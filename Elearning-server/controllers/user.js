import { User } from "../models/user.js";
import bcrypt from 'bcrypt';  // ES module style
import jwt from 'jsonwebtoken';  // ES module style
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Progress } from "../models/Progress.js";
import { Lecture } from "../models/Lecture.js";


export const register = TryCatch(async (req,res) => {
    try
    {
        const { email,name,password } = req.body;
         
        
        let user = await User.findOne({ email });

        if(user) return res.status(400).json({ 
            msg: "User already exists"
         });
        
        const hasedPassword =  await bcrypt.hash(password,10); 
        user={
            name,
            email,
            password : hasedPassword
        }

        const otp = Math.floor( Math.random() * 1000000);
        const activationToken = jwt.sign({
            user,
            otp
        },process.env.Activation_Secret,{
            expiresIn: "5m",
        });

        const data =
        {   
            name,
            otp,
        };
        await sendMail(
            email,
            "E Learning Platform",
            data
        )
        console.log(data);
        res.status(200).json({
            messsage : "otp send to your email",
            activationToken,
        })

    }
    catch(error)
    {
        res.status(500).json(
            {
                messsage :error.messsage,  
            });
    }
    
});

export const verifyUser = TryCatch(async (req,res) => {
    const { otp,activationToken } = req.body;
    const verify = jwt.verify(activationToken, process.env.Activation_Secret);
    if(!verify)
        return res.status(400).json({
            messsage : "Otp expired",
        });
    if(verify.otp !== otp)
        return res.status(400).json({
            messsage : "Wronf otp",
        });
        
    await User.create({
        name : verify.user.name,
        email : verify.user.email,
        password : verify.user.password,
    })
    res.json (
        {
            messsage :"User registed successfully",
        }
    )
});

export const loginUser = TryCatch(async (req,res) => {
    const { email,password } = req.body
    const user = await User.findOne({email}) 

    if(!user) 
        return res.status(400).json({
        message : "User not found with this email",
         });
    const mathPassword = await bcrypt.compare(password,user.password);

    if(!mathPassword)  
        return res.status(400).json({
        message : "Password didnt match",
        });

    const token  = jwt.sign({ _id : user._id},process.env.Jwt_Sec,{
        expiresIn : "15d",
    });
    res.json({
        message :`welcome back ${user.name}`,
        token,
        user, 
    })
});


export const myProfile = TryCatch(async (req,res) => {
    const user = await User.findById(req.user._id)


    res.json({user})
});

export const getAllTeachers = TryCatch(async (req, res) => {
    const teachers = await User.find({ role: "teacher" }).select("-password"); // Excluding password field for security
    
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }
  
    res.json({ teachers });
  });

  export const teacherDashboard = TryCatch(async (req, res) => {
    const teacherId = req.params.id; // Get the teacher's ID from the route parameter
    
    // Fetch the teacher's name using the ID
    const teacher = await User.findById(teacherId); 
    // console.log(teacher)
    if (!teacher) {
        return res.status(404).json({
            success: false,
            message: "Teacher not found",
        });
    }
    console.log(teacher)

    const teacherName = teacher.name; // Extract the name of the teacher
    
    console.log(teacherName)
    // Fetch courses created by the teacher's name
    const courses = await Courses.find({ createdBy: teacherName });
   

    let totalStudents = 0;
    let totalRevenue = 0;

    for (const course of courses) {
        const studentsEnrolled = await Progress.find({ course: course._id }).countDocuments();
        totalStudents += studentsEnrolled;
        totalRevenue += studentsEnrolled * course.price;
    }
    

    res.json({
        success: true,
        data: {
            totalCourses: courses.length,
            totalStudents,
            totalRevenue,
            courses,
        },
    });
});

export const teachersCourses = TryCatch(async (req, res) => {
    const teacherId = req.params.id;

    // Validate the teacherId format
    if (!teacherId || teacherId.length !== 24) {
        return res.status(400).json({
            success: false,
            message: "Invalid teacher ID",
        });
    }

    try {
        // Fetch the teacher's details using the ID
        const teacher = await User.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        // Fetch courses created by this teacher
        const courses = await Courses.find({ owner: teacherId });

        console.log("Fetched Courses:", courses.length); // ✅ Debugging log

        // Instead of returning a 404, return an empty array if no courses exist
        return res.status(200).json({
            success: true,
            data: courses,
            message: courses.length > 0 ? "Courses fetched successfully" : "No courses found for this teacher",
        });
    } catch (error) {
        console.error("Error fetching teacher courses:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching teacher courses",
            error: error.message,
        });
    }
});


export const deleteCourse = TryCatch(async (req, res) => {
    // Find the course by ID
    const course = await Courses.findById(req.params.id);
    console.log(course)
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
  
