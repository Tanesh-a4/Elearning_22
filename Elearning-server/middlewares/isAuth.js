import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Authentication middleware to verify JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
export const isAuth = async (req, res, next) => {
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

/**
 * Authorization middleware to check if user is a teacher
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
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

/**
 * Authorization middleware to check if user is an admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
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