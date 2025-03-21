  import { User } from "../models/user.js";
import TryCatch from "../middlewares/TryCatch.js";
import {Courses} from "../models/Courses.js"
import {Lecture} from "../models/Lecture.js"
import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import {Progress} from "../models/Progress.js"
import { log } from "console";

export const getAllCourses = TryCatch(async(req,res)=>{
    const courses = await Courses.find();
    
    res.json(
        {
            courses,
        });
});


export const getSingleCourse = TryCatch (async(req,res)=>{
    const course = await Courses.findById(req.params.id);

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

export const fetchLectures = TryCatch(async(req,res)=>{
    const lectures = await Lecture.find({course: req.params.id});
    // console.log(lectures)
    const user = await User.findById(req.user._id);
    
    if(user.role === "admin" || user.role === "teacher"){
        return res.json({
            lectures
        });
    }
    
    // Fix the subscription check by comparing string versions of ObjectIds
    const hasAccess = user.subscription.some(id => id.toString() === req.params.id);
    if(!hasAccess)
        return res.status(400).json({
            message : "You have not access to the courses"
        });

    res.json({lectures});
});

export const fetchlecutre = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if(user.role === "admin" || user.role === "teacher"){
        return res.json({
            lecture
        });
    }
    
    // Fix the subscription check by comparing string versions of ObjectIds
    const hasAccess = user.subscription.some(id => id.toString() === lecture.course.toString());
    if(!hasAccess)
        return res.status(400).json({
            message : "You have not access to the courses"
        });

    res.json({lecture});
});

export const getMycourses = TryCatch (async(req,res)=>{
    const courses = await Courses.find({_id: req.user.subscription})
    res.json({
        courses,
    })
});

export const checkout = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    const course = await Courses.findById(req.params.id);
  
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You already have this course",
      });
    }
  
    const options = {
      amount: Number(course.price * 100),
      currency: "INR",
    };
  
    const order = await instance.orders.create(options);
  
    res.status(201).json({
      order,
      course,
    });
  });

  export const paymentVerification = TryCatch(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
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
  
      await user.save();
  
      res.status(200).json({
        message: "Course Purchased Successfully",
      });
    } else {
      return res.status(400).json({
        message: "Payment Failed",
      });
    }
  });

  export const addProgress = TryCatch(async (req, res) => {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });
  
    const { lectureId } = req.query;
  
    if (progress.completedLectures.includes(lectureId)) {
      return res.json({
        message: "Progress recorded",
      });
    }
  
    progress.completedLectures.push(lectureId);
  
    await progress.save();
  
    res.status(201).json({
      message: "new Progress added",
    });
  });


  export const getYourProgress = TryCatch(async (req, res) => {
    const progress = await Progress.find({
      user: req.user._id,
      course: req.query.course,
    });
  
    if (!progress) return res.status(404).json({ message: "null" });
  
    const allLectures = (await Lecture.find({ course: req.query.course })).length;
  
    const completedLectures = progress[0].completedLectures.length;
  
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
  
    // Ensure the course exists and fetch its details
    const course = await Courses.findById(courseId).populate('owner', 'name email');
    if (!course) {
        return res.status(404).json({ message: "Course not found." });
    }

    // Get users subscribed to the course
    const subscribedUsers = await User.find({ subscription: courseId }).select("name email");

    if (!subscribedUsers.length) {
        return res.status(404).json({ message: "No users subscribed to this course." });
    }

    // Fetch progress data for each subscribed user
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

    // Calculate total revenue
    const totalRevenue = subscribedUsers.length * course.price;

    res.json({
        courseId,
        totalSubscribers: subscribedUsers.length,
        totalRevenue,
        progress: progressData,
    });
});

  

  export const getMonthlyStats = async (req, res) => {
    try {
        const teacherId = req.user.id; // Get teacher ID from token

        // Find all courses owned by this teacher
        const teacherCourses = await Courses.find({ owner: teacherId }).select("_id");
        if (!teacherCourses.length) {
            return res.status(404).json({ message: "No courses found for this teacher." });
        }

        const courseIds = teacherCourses.map(course => course._id);

        // Aggregate payments by month
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

        // Generate last 6 months' data
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

    } catch (error) {
        console.error("Error fetching monthly stats:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};
