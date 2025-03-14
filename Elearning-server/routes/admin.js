import express from 'express'
import { isAdmin, isAuth ,isAdminOrTeacher} from '../middlewares/isAuth.js';
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllstats, updateRole, getAllUser, deleteUser } from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js'
import { User } from '../models/user.js';
import { TryCatch } from '../middlewares/TryCatch.js';

const router = express.Router();

router.post("/course/new",isAuth,isAdminOrTeacher,uploadFiles,createCourse);
router.post("/course/:id", isAuth, isAdminOrTeacher, uploadFiles, addLectures);
router.delete("/lecture/:id", isAuth, isAdminOrTeacher, deleteLecture);

router.delete("/course/:id", isAuth, isAdminOrTeacher, deleteCourse);
router.get("/stats",isAuth,isAdmin,getAllstats);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);

router.delete("/user/:id", isAuth, isAdmin, TryCatch(async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete user." });
    }
  }));


export default router;