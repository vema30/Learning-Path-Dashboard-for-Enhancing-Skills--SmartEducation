const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header, cookies, or request body
        const token = 
            req.header("Authorization")?.replace("Bearer ", "") || 
            req.cookies?.token || 
            req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store user data in request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

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

module.exports = {auth, isStudent, isInstructor, isAdmin };
