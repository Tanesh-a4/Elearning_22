import { Courses } from "../../models/Courses.js";
import { Lecture } from "../../models/Lecture.js";
import { User } from "../../models/user.js";
import { unlink } from "fs"; // Import only unlink for file deletion
import { promisify } from "util";
import fs from 'fs';

const unlinkAsync = promisify(unlink);

export const adminResolvers = {
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

      return {
        message: "Course created successfully",
      };
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

      return {
        message: "Lecture added successfully",
        lecture,
      };
    },

    deleteLecture: async (_, { lectureId }, { user }) => {
      const lecture = await Lecture.findById(lectureId);
      if (!lecture) throw new Error("Lecture not found");

      // Deleting video file
      if (lecture.video) {
        try {
          await unlinkAsync(lecture.video);
          console.log("Video deleted successfully");
        } catch (error) {
          console.error("Error deleting video:", error.message);
        }
      }

      await lecture.deleteOne();

      return {
        message: "Lecture deleted successfully",
      };
    },

    deleteCourse: async (_, { courseId }, { user }) => {
      const course = await Courses.findById(courseId);
      if (!course) throw new Error("Course not found");

      // Deleting associated lectures
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

      // Deleting course image
      if (course.image) {
        try {
          await unlinkAsync(course.image);
          console.log("Image deleted:", course.image);
        } catch (error) {
          console.error("Error deleting image:", error.message);
        }
      }

      await Lecture.deleteMany({ course: courseId });
      await course.deleteOne();
      await User.updateMany({}, { $pull: { subscription: courseId } });

      return {
        message: "Course deleted successfully",
      };
    },

    updateRole: async (_, { userId, role }, { user }) => {
      if (user.mainrole !== "superadmin") {
        throw new Error("This endpoint is assigned to superadmin");
      }

      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        message: "User role updated successfully",
        user: updatedUser,
      };
    },

    deleteUser: async (_, { userId }, { user }) => {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("User not found");
      }

      return {
        message: "User deleted successfully",
        user: deletedUser,
      };
    },
  },

  Query: {
    getAllStats: async (_, __, { user }) => {
      const totalCourses = await Courses.countDocuments();
      const totalLectures = await Lecture.countDocuments();
      const totalUsers = await User.countDocuments();

      const userDistribution = await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      const courseRegistrationStats = await Courses.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "subscription",
            as: "subscribers",
          },
        },
        {
          $project: {
            title: 1,
            registrationCount: { $size: "$subscribers" },
          },
        },
      ]);

      return {
        totalCourses,
        totalLectures,
        totalUsers,
        userDistribution,
        courseRegistrationStats,
      };
    },

    getAllUsers: async (_, __, { user }) => {
      const users = await User.find({ _id: { $ne: user._id } }).select("-password");
      return { users };
    },
  },
};
