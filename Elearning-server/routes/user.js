import express from 'express';
import { loginUser, myProfile, register, verifyUser } from '../controllers/user.js';
import { isAuth, isTeacher } from '../middlewares/isAuth.js';
import { addProgress, getUserCourses, getYourProgress } from '../controllers/course.js';
import { getAllTeachers, teachersCourses, deleteCourse, teacherDashboard } from '../controllers/user.js';
import { User } from "../models/user.js";
import { TryCatch } from '../middlewares/TryCatch.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher-specific operations
 */

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Course Progress Management
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Registration successful, OTP sent
 */
router.post('/user/register', register);

/**
 * @swagger
 * /api/user/verify:
 *   post:
 *     summary: Verify user with OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - activationToken
 *             properties:
 *               otp:
 *                 type: number
 *               activationToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 */
router.post('/user/verify', verifyUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/user/login', loginUser);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
router.get("/user/me", isAuth, myProfile);

/**
 * @swagger
 * /api/user/progress:
 *   post:
 *     summary: Update/add course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - lecture
 *             properties:
 *               course:
 *                 type: string
 *                 description: Course ID
 *               lecture:
 *                 type: string
 *                 description: Lecture ID
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.post("/user/progress", isAuth, addProgress);

/**
 * @swagger
 * /api/user/progress:
 *   get:
 *     summary: Get user's course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress data
 */
router.get("/user/progress", isAuth, getYourProgress);

/**
 * @swagger
 * /api/user/teachers:
 *   get:
 *     summary: Get list of all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 */
router.get("/user/teachers", getAllTeachers);

/**
 * @swagger
 * /api/teacher/{id}/dashboard:
 *   get:
 *     summary: Get teacher's dashboard stats
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get("/teacher/:id/dashboard", isAuth, isTeacher, teacherDashboard);

/**
 * @swagger
 * /api/teacher/{id}/courses:
 *   get:
 *     summary: Get courses created by teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: List of teacher's courses
 */
router.get("/teacher/:id/courses", isAuth, isTeacher, teachersCourses);

/**
 * @swagger
 * /api/teacher/course/{id}:
 *   delete:
 *     summary: Delete a course (Teacher only)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete("/teacher/course/:id", isAuth, isTeacher, deleteCourse);

/**
 * @swagger
 * /api/user/{id}/courses:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's enrolled courses
 */
router.get("/user/:id/courses", isAuth, getUserCourses);

/**
 * @swagger
 * /api/unenroll:
 *   post:
 *     summary: Unenroll a user from a course
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: Course ID
 *     responses:
 *       200:
 *         description: Unenrolled successfully
 *       400:
 *         description: User not enrolled
 */
router.post("/unenroll", TryCatch(async (req, res) => {
  const { courseId , user} = req.body;
  const userId = user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.subscription.includes(courseId)) {
      return res.status(400).json({ message: "User is not enrolled in this course" });
    }
    user.subscription = user.subscription.filter(id => !id.equals(courseId));
    await user.save();
    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}));

/**
 * @swagger
 * /api/users/{userId}:
 *   patch:
 *     summary: Update a user's designation
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - designation
 *             properties:
 *               designation:
 *                 type: string
 *                 description: New designation (e.g., "teacher", "admin")
 *     responses:
 *       200:
 *         description: Designation updated
 *       404:
 *         description: User not found
 */
router.patch("/users/:userId", TryCatch(async (req, res) => {
  const { userId } = req.params;
  const { designation } = req.body;
  const user = await User.findByIdAndUpdate(userId, { designation }, { new: true });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "Designation updated successfully", user });
}));




export default router;
