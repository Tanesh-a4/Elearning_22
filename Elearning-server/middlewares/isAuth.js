import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuth = async (req,res,next) => {
    try {
        const token = req.headers.token;
        if(!token) 
           return res.status(403).json({
            message: "Please login"
        });
        const decodedData = jwt.verify(token,process.env.Jwt_Sec);
        req.user = await User.findById(decodedData._id);
        next()
    } catch (error) {
        res.status(500).json({
            message: "Login first"
        });
    }  
};

export const isTeacher = (req, res, next) => {
    try {
      if (req.user.role !== "teacher") {
        return res.status(403).json({
          message: "You are not authorized to access this route",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


export const isAdmin = (req,res,next) =>{
        try {
            if(req.user.role  !== "admin")
                return res.status(403).json({
                    message : "You are not admin"   
                });
            next();
            } catch (error) {
            res.status(500).json({
                message: error.message
            }); 
        }
}

export const isAdminOrTeacher = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "teacher")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};