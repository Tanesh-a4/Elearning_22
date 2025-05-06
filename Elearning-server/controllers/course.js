import { User } from "../models/user.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { PaymentHistory } from "../models/PaymentHistory.js";
import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { getCache, setCache, deleteCache } from '../config/redis.js';

export const getAllCourses = TryCatch(async(req, res) => {
    // Try to get courses from Redis cache first
    const cachedCourses = await getCache("all_courses");
    
    if (cachedCourses) {
        return res.json({ courses: JSON.parse(cachedCourses) });
    }
    
    // If not in cache, fetch from database
    const courses = await Courses.find();
    
    // Store in Redis cache for future requests (cache for 10 minutes)
    await setCache("all_courses", JSON.stringify(courses), 600);
    
    res.json({ courses });
});

export const getSingleCourse = TryCatch(async(req, res) => {
    const courseId = req.params.id;
    
    // Try to get from cache
    const cachedCourse = await getCache(`course:${courseId}`);
    
    if (cachedCourse) {
        return res.json({
            course: JSON.parse(cachedCourse)
        });
    }
    
    // If not cached, get from DB
    const course = await Courses.findById(courseId);
    
    // Store in cache
    await setCache(`course:${courseId}`, JSON.stringify(course), 3600); // Cache for 1 hour
    
    res.json({
        course,
    });
});

export const getUserCourses = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).populate("subscription");

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, courses: user.subscription });
});

export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.role === "teacher") {
        return res.json({ lectures });
    }

    const hasAccess = user.subscription.some(id => id.toString() === req.params.id);
    if (!hasAccess) {
        return res.status(400).json({ message: "You have no access to the course" });
    }

    res.json({ lectures });
});

export const fetchlecutre = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (user.role === "admin" || user.role === "teacher") {
        return res.json({ lecture });
    }

    const hasAccess = user.subscription.some(id => id.toString() === lecture.course.toString());
    if (!hasAccess) {
        return res.status(400).json({ message: "You have no access to the course" });
    }

    res.json({ lecture });
});

export const getMycourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ _id: req.user.subscription });
    res.json({ courses });
});

export const checkout = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (user.subscription.includes(course._id)) {
        return res.status(400).json({ message: "You already have this course" });
    }

    const options = {
        amount: Number(course.price * 100),
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(201).json({ order, course });
});

export const paymentVerification = TryCatch(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.Razorpay_Secret)
        .update(body)
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        const user = await User.findById(req.user._id);
        const course = await Courses.findById(req.params.id);

        user.subscription.push(course._id);

        await Progress.create({
            course: course._id,
            completedLectures: [],
            user: req.user._id,
        });

        await PaymentHistory.create({
            userId: req.user._id,
            courseId: course._id,
            paymentId: razorpay_payment_id,
            status: 'completed',
            amount: course.price
        });

        await user.save();

        // Invalidate cache after course purchase
        await deleteCache("all_courses");
        await deleteCache(`course:${req.params.id}`);

        res.status(200).json({ message: "Course Purchased Successfully" });
    } else {
        return res.status(400).json({ message: "Payment Failed" });
    }
});

export const addProgress = TryCatch(async (req, res) => {
    const progress = await Progress.findOne({
        user: req.user._id,
        course: req.query.course,
    });

    const { lectureId } = req.query;

    if (progress.completedLectures.includes(lectureId)) {
        return res.json({ message: "Progress recorded" });
    }

    progress.completedLectures.push(lectureId);

    await progress.save();

    res.status(201).json({ message: "New Progress Added" });
});

export const getYourProgress = TryCatch(async (req, res) => {
    const progress = await Progress.find({
        user: req.user._id,
        course: req.query.course,
    });

    if (!progress) return res.status(404).json({ message: "null" });

    const allLectures = (await Lecture.find({ course: req.query.course })).length;
    const completedLectures = progress[0]?.completedLectures.length || 0;
    const courseProgressPercentage = (completedLectures * 100) / allLectures;

    res.json({
        courseProgressPercentage,
        completedLectures,
        allLectures,
        progress,
    });
});

export const generateCourseReport = TryCatch(async (req, res) => {
    const { id: courseId } = req.params;

    const course = await Courses.findById(courseId).populate('owner', 'name email');
    if (!course) {
        return res.status(404).json({ message: "Course not found." });
    }

    const subscribedUsers = await User.find({ subscription: courseId }).select("name email");

    if (!subscribedUsers.length) {
        return res.status(404).json({ message: "No users subscribed to this course." });
    }

    const progressData = await Promise.all(
        subscribedUsers.map(async (user) => {
            const progress = await Progress.findOne({ course: courseId, user: user._id })
                .populate("completedLectures", "title")
                .select("completedLectures");

            return {
                name: user.name,
                email: user.email,
                completedLectures: progress?.completedLectures.length || 0,
            };
        })
    );

    const totalRevenue = subscribedUsers.length * course.price;

    res.json({
        courseId,
        totalSubscribers: subscribedUsers.length,
        totalRevenue,
        progress: progressData,
    });
});

export const getMonthlyStats = TryCatch(async (req, res) => {
    const teacherId = req.user.id;

    const teacherCourses = await Courses.find({ owner: teacherId }).select("_id");
    if (!teacherCourses.length) {
        return res.status(404).json({ message: "No courses found for this teacher." });
    }

    const courseIds = teacherCourses.map(course => course._id);

    const monthlyStats = await Payment.aggregate([
        {
            $match: { course: { $in: courseIds } }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalRevenue: { $sum: "$amountPaid" },
                transactionCount: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const currentDate = new Date();
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        const month = date.toLocaleString("default", { month: "short" });

        const record = monthlyStats.find(
            stat => stat._id.month === date.getMonth() + 1 && stat._id.year === date.getFullYear()
        );

        lastSixMonths.push({
            month,
            revenue: record ? record.totalRevenue : 0,
            transactions: record ? record.transactionCount : 0
        });
    }

    res.status(200).json({ monthlyStats: lastSixMonths });
});

export const checkPaymentHistory = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const courseId = req.params.courseId;

    const hasPaymentRecord = await PaymentHistory.findOne({
        userId: req.user._id,
        courseId: courseId,
        status: 'completed'
    });

    return res.status(200).json({
        success: true,
        hasPaid: !!hasPaymentRecord
    });
});

export const directEnroll = TryCatch(async (req, res) => {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.subscription.includes(courseId)) {
        return res.status(400).json({
            success: false,
            message: "Already enrolled in this course"
        });
    }

    const hasPaymentRecord = await PaymentHistory.findOne({
        userId: req.user._id,
        courseId: courseId,
        status: 'completed'
    });

    if (!hasPaymentRecord) {
        return res.status(400).json({
            success: false,
            message: "Payment required for this course"
        });
    }

    user.subscription.push(courseId);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Successfully enrolled in the course"
    });
});
