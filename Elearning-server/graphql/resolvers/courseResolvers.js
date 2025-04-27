import { Courses } from "../../models/Courses.js";
import { Lecture } from "../../models/Lecture.js";
import { User } from "../../models/user.js";
import { PaymentHistory } from "../../models/PaymentHistory.js";
import { Progress } from "../../models/Progress.js";
import { Payment } from "../../models/Payment.js";
import crypto from "crypto";
import { instance } from "../../index.js";
import { unlink } from "fs"; 
import { promisify } from "util";

const unlinkAsync = promisify(unlink);

export const courseResolvers = {
  Query: {
    getAllCourses: async () => {
      const courses = await Courses.find();
      return { courses };
    },
    getSingleCourse: async (_, { id }) => {
      const course = await Courses.findById(id);
      return { course };
    },
    fetchLectures: async (_, { courseId }, { user }) => {
      const lectures = await Lecture.find({ course: courseId });

      // Check for admin or teacher role
      if (user.role === "admin" || user.role === "teacher") {
        return { lectures };
      }

      const hasAccess = user.subscription.some(id => id.toString() === courseId);
      if (!hasAccess) {
        throw new Error("You do not have access to this course.");
      }

      return { lectures };
    },
  },

  Mutation: {
    createCourse: async (_, { title, description, category, createdBy, duration, price, image }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const course = await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
        duration,
        price,
        owner: user._id,
      });

      return { message: "Course created successfully" };
    },

    addLectures: async (_, { courseId, title, description, video }, { user }) => {
      const course = await Courses.findById(courseId);
      if (!course) throw new Error("Course not found");

      const lecture = await Lecture.create({
        title,
        description,
        video: video?.path,
        course: course._id,
      });

      return { message: "Lecture added successfully", lecture };
    },

    deleteLecture: async (_, { lectureId }, { user }) => {
      const lecture = await Lecture.findById(lectureId);
      if (!lecture) throw new Error("Lecture not found");

      // Deleting video file if exists
      if (lecture.video) {
        try {
          await unlinkAsync(lecture.video);
          console.log("Video deleted successfully");
        } catch (error) {
          console.error("Error deleting video:", error.message);
        }
      }

      await lecture.deleteOne();
      return { message: "Lecture deleted successfully" };
    },

    deleteCourse: async (_, { courseId }, { user }) => {
      const course = await Courses.findById(courseId);
      if (!course) throw new Error("Course not found");

      // Deleting associated lectures and videos
      const lectures = await Lecture.find({ course: course._id });
      await Promise.all(
        lectures.map(async (lecture) => {
          if (lecture.video) {
            try {
              await unlinkAsync(lecture.video);
              console.log("Video deleted:", lecture.video);
            } catch (error) {
              console.error("Error deleting video:", error.message);
            }
          }
        })
      );

      await course.deleteOne();
      return { message: "Course deleted successfully" };
    },

    checkout: async (_, { courseId }, { user }) => {
      const course = await Courses.findById(courseId);

      if (user.subscription.includes(course._id)) {
        throw new Error("You already have this course.");
      }

      const options = {
        amount: Number(course.price * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);

      return { order, course };
    },

    paymentVerification: async (_, { razorpay_order_id, razorpay_payment_id, razorpay_signature }, { user }) => {
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

        const course = await Courses.findById(razorpay_order_id);

        user.subscription.push(course._id);
        await Progress.create({
          course: course._id,
          completedLectures: [],
          user: user._id,
        });

        await PaymentHistory.create({
          userId: user._id,
          courseId: course._id,
          paymentId: razorpay_payment_id,
          status: 'completed',
          amount: course.price,
        });

        await user.save();
        return { message: "Course Purchased Successfully" };
      } else {
        throw new Error("Payment Failed");
      }
    },

    addProgress: async (_, { courseId, lectureId }, { user }) => {
      const progress = await Progress.findOne({
        user: user._id,
        course: courseId,
      });

      if (progress.completedLectures.includes(lectureId)) {
        return { message: "Progress already recorded" };
      }

      progress.completedLectures.push(lectureId);
      await progress.save();

      return { message: "Progress recorded" };
    },

    getMyCourses: async (_, __, { user }) => {
      const courses = await Courses.find({ _id: { $in: user.subscription } });
      return { courses };
    },

    generateCourseReport: async (_, { courseId }, { user }) => {
      const course = await Courses.findById(courseId).populate('owner', 'name email');
      if (!course) throw new Error("Course not found.");

      const subscribedUsers = await User.find({ subscription: courseId }).select("name email");

      if (!subscribedUsers.length) {
        throw new Error("No users subscribed to this course.");
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

      return {
        courseId,
        totalSubscribers: subscribedUsers.length,
        totalRevenue,
        progress: progressData,
      };
    },

    getMonthlyStats: async (_, __, { user }) => {
      const teacherId = user.id;

      const teacherCourses = await Courses.find({ owner: teacherId }).select("_id");
      if (!teacherCourses.length) {
        throw new Error("No courses found for this teacher.");
      }

      const courseIds = teacherCourses.map(course => course._id);

      const monthlyStats = await Payment.aggregate([
        {
          $match: { course: { $in: courseIds } },
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalRevenue: { $sum: "$amountPaid" },
            transactionCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
      ]);

      const currentDate = new Date();
      const lastSixMonths = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(currentDate.getMonth() - i);
        const month = date.toLocaleString("default", { month: "short" });

        const record = monthlyStats.find(
          (stat) => stat._id.month === date.getMonth() + 1 && stat._id.year === date.getFullYear()
        );

        lastSixMonths.push({
          month,
          revenue: record ? record.totalRevenue : 0,
          transactions: record ? record.transactionCount : 0,
        });
      }

      return { monthlyStats: lastSixMonths };
    },
  },
};
