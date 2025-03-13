import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import {rm } from 'fs';
import { promisify } from "util";
import fs from 'fs';
import { User } from "../models/user.js";

export const createCourse = TryCatch(async (req, res) => {
    const {title,description,category ,createdBy,duration ,price} = req.body;
    const userId = req.user._id;
    const image = req.file;
    await Courses.create(
        {
            title,
            description,
            category,
            createdBy,
            image: image?.path,
            duration,
            price,
            owner: userId,
        });
    res.status(201).json({
        message: "Course created successfully",
    })

});

export const addLectures = TryCatch(async(req, res)=>{
    const course = await Courses.findById(req.params.id)
    if(!course){
        return res.status(404).json({
            message: "No course exist with this ID",
        })
    }
    const {title, description} = req.body;
    const file = req.file;

    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,

    });
    res.status(201).json({
        message: "Lecture Added",
        lecture,
    });

});

export const deleteLecture = TryCatch (async (req,res) => {
    const  lecture = await Lecture.findById(req.params.id)
   rm(lecture.video,()=>{
    console.log("video deleted");
   });
   await lecture.deleteOne();
   res.json({
    message :"lecture deleted"
   });
    
});


const unlinkAsync = promisify(fs.unlink)

export const deleteCourse = TryCatch(async (req, res) => {
    // Find the course by ID
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
  
    // Find associated lectures
    const lectures = await Lecture.find({ course: course._id });
  
    // Delete all video files associated with lectures
    await Promise.all(
      lectures.map(async (lecture) => {
        try {
          await unlinkAsync(lecture.video);
          console.log("Video deleted:", lecture.video);
        } catch (error) {
          console.error("Error deleting video:", error.message);
        }
      })
    );
  
    // Delete course image
    try {
      rm(course.image, () => {
        console.log("Image deleted:", course.image);
      });
    } catch (error) {
      console.error("Error deleting image:", error.message);
    }
  
    // Delete lectures associated with the course
    await Lecture.deleteMany({ course: req.params.id });
  
    // Delete the course itself
    await course.deleteOne();
  
    // Update users by removing the course from their subscriptions
    await User.updateMany({}, { $pull: { subscription: req.params.id } });
  
    // Send success response
    res.json({
      message: "Course deleted successfully",
    });
  });
  


export const getAllstats = TryCatch (async (req,res) => {
    const totalcourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUser = (await User.find()).length;
    const userDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role", // Group by the 'role' field
          count: { $sum: 1 }, // Count the number of users for each role
        },
      },
    ]);

    const courseRegistrationStats = await Courses.aggregate([
      {
        $lookup: {
          from: "users", // Collection name for the User model
          localField: "_id", // Match Courses `_id` with `subscription` in User
          foreignField: "subscription", // User's `subscription` array
          as: "subscribers", // Resulting array of users who subscribed
        },
      },
      {
        $project: {
          title: 1, // Include course title
          registrationCount: { $size: "$subscribers" }, // Count the number of subscribers
        },
      },
    ]);
 

    const stats ={
        totalcourses ,
        totalLectures ,
        totalUser ,
        userDistribution,
        courseRegistrationStats,
    };
    res.json(
        {
            stats,
        }
    )


});

export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
  
    res.json({ users });
  });

  export const updateRole = TryCatch(async (req, res) => {

    const { id } = req.params;
    const { role } = req.body; 
    console.log(role);
    if (req.user.mainrole !== "superadmin")
      return res.status(403).json({
        message: "This endpoint is assign to superadmin",
      });
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User role updated successfully", user });
  });


  export const deleteUser = TryCatch(async (req, res) => {
    try {
      const { userId } = req.params; // Assuming the user ID is passed as a route parameter

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
