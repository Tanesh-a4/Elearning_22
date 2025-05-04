import express from 'express'
import { getAllCourses, getSingleCourse, fetchLectures, fetchlecutre, getMycourses, checkout, paymentVerification, generateCourseReport, getMonthlyStats, checkPaymentHistory, directEnroll } from '../controllers/course.js';
import { isAuth, isTeacher, isAdminOrTeacher } from '../middlewares/isAuth.js'
import { TryCatch } from '../middlewares/TryCatch.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         createdBy:
 *           type: string
 *         image:
 *           type: string
 *         duration:
 *           type: string
 *         price:
 *           type: number
 *         owner:
 *           type: string
 *           description: User ID who created the course
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /api/course/all:
 *   get:
 *     summary: Get all available courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get("/course/all", getAllCourses);

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     summary: Get a specific course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get("/course/:id", getSingleCourse);

/**
 * @swagger
 * /api/lectures/{id}:
 *   get:
 *     summary: Get all lectures for a course
 *     tags: [Lectures]
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
 *         description: List of lectures
 *       403:
 *         description: Not authenticated
 */
router.get('/lectures/:id', isAuth, fetchLectures);

/**
 * @swagger
 * /api/lecture/{id}:
 *   get:
 *     summary: Get a single lecture by ID
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture details
 *       404:
 *         description: Lecture not found
 */
router.get('/lecture/:id', isAuth, fetchlecutre);

/**
 * @swagger
 * /api/mycourse:
 *   get:
 *     summary: Get courses enrolled by the authenticated user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *       403:
 *         description: Not authenticated
 */
router.get("/mycourse", isAuth, getMycourses);

/**
 * @swagger
 * /api/course/checkout/{id}:
 *   post:
 *     summary: Checkout and create payment for a course
 *     tags: [Payments]
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
 *         description: Payment created
 *       400:
 *         description: Bad request
 */
router.post("/course/checkout/:id", isAuth, checkout);

/**
 * @swagger
 * /api/verification/{id}:
 *   post:
 *     summary: Verify payment for a course
 *     tags: [Payments]
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
 *         description: Payment verified successfully
 *       400:
 *         description: Verification failed
 */
router.post("/verification/:id", isAuth, paymentVerification);

/**
 * @swagger
 * /api/courses/{id}/report:
 *   get:
 *     summary: Generate a course report (teacher only)
 *     tags: [Reports]
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
 *         description: Course report generated
 *       403:
 *         description: Not authorized
 */
router.get("/courses/:id/report", isAuth, isTeacher, generateCourseReport);

/**
 * @swagger
 * /api/courses/{id}/report:
 *   post:
 *     summary: Generate a course report (teacher only)
 *     tags: [Reports]
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
 *         description: Course report generated
 *       403:
 *         description: Not authorized
 */
router.post("/courses/:id/report", isAuth, generateCourseReport);

/**
 * @swagger
 * /api/monthly-stats:
 *   get:
 *     summary: Get monthly course statistics (teacher only)
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly statistics
 *       403:
 *         description: Not authorized
 */
router.get("/monthly-stats", isTeacher, getMonthlyStats);

/**
 * @swagger
 * /api/check-payment-history/{courseId}:
 *   get:
 *     summary: Check if user has payment history for a course
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Payment history found
 *       404:
 *         description: Payment history not found
 */
router.get('/check-payment-history/:courseId', isAuth, checkPaymentHistory);

/**
 * @swagger
 * /api/direct-enroll:
 *   post:
 *     summary: Enroll user directly into a course without payment
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: Course ID to enroll into
 *     responses:
 *       200:
 *         description: User enrolled successfully
 *       400:
 *         description: Bad request
 */
router.post('/direct-enroll', isAuth, directEnroll);

export default router;
