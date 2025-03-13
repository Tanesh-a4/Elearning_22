import express from 'express';
import { loginUser, myProfile, register, verifyUser } from '../controllers/user.js';
import { isAuth, isTeacher } from '../middlewares/isAuth.js';
import { addProgress, getYourProgress } from '../controllers/course.js';
import { getAllTeachers, teachersCourses, deleteCourse } from '../controllers/user.js';
import { teacherDashboard } from '../controllers/user.js';
import { User } from "../models/user.js";
import { TryCatch } from '../middlewares/TryCatch.js';

const router = express.Router();


router.post('/user/register',register); 
router.post('/user/verify',verifyUser);
router.post('/user/login',loginUser);
router.get("/user/me",isAuth,myProfile);
router.post("/user/progress",isAuth,addProgress);
router.get("/user/progress",isAuth,getYourProgress);
router.get("/user/teachers", getAllTeachers); 
router.get("/teacher/:id/dashboard", isAuth, isTeacher, teacherDashboard);
router.get("/teacher/:id/courses", isAuth, isTeacher, teachersCourses);
router.delete("/teacher/course/:id", isAuth, isTeacher, deleteCourse);

router.post("/unenroll", TryCatch(async (req, res) => {
  const { courseId , user} = req.body;
    const userId = user._id;
  console.log(courseId)
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the user is already enrolled in the course
    if (!user.subscription.includes(courseId)) {
      return res.status(400).json({ message: "User is not enrolled in this course" });
    }

    // Remove the course from user's subscription
    user.subscription = user.subscription.filter(id => !id.equals(courseId));
    await user.save();

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}));


router.patch("/users/:userId", TryCatch(async (req, res) => {
    try {
      const { userId } = req.params;
      const { designation } = req.body; // Get designation from the request body
  
      // Find user and update their designation
      const user = await User.findByIdAndUpdate(
        userId,
        { designation },
        { new: true } // Return the updated user
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Designation updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }));

export default router;