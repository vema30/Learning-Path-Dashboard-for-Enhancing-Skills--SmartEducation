const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header or cookies (strongly prefer these two sources)
        const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization").replace("Bearer ", "");

            console.log("token in backend ",token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided",
            });
        }console.log('token in auth ',token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user info to the request object
        req.user = decoded;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// Check if the user is a Student
const isStudent = async (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only Students are allowed",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Student authorization",
        });
    }
};

// Check if the user is an Instructor
const isInstructor = async (req, res, next) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only Instructors are allowed",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Instructor authorization",
        });
    }
};

// Check if the user is an Admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Only Admins are allowed",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Admin authorization",
        });
    }
};

module.exports = { auth, isStudent, isInstructor, isAdmin };
