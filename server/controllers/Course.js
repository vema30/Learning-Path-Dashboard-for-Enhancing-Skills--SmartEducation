require("dotenv").config();
const Course= require("../models/Course");

const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const createCourse = async (req, res) => {  
    try {
        const { courseName, courseDescription, whatYouWillLearn, Category, price } = req.body;
        const thumbnail = req.files.thumnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !tag || !price || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }
        
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag not found"
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const course = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            instructor: instructorDetails._id,
            Category: Category
        });

        // Update the tag to include the new course
        await Category.findByIdAndUpdate(tagDetails._id, {
            $push: {
                courses: course._id
            }
        }, { new: true });

        // , update the instructor with the new course
        await User.findByIdAndUpdate(instructorDetails._id, {
            $push: {
                courses: course._id
            }
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

        
const showAllCourses = async (req, res) => {
    try {
        // Fetch all courses and populate instructor and tag details
        const courses = await Course.find({});
            // .populate("instructor", "firstName lastName email") // Populate instructor details
            // .populate("tag", "name description") // Populate tag details
            // .exec();

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

module.exports={
    createCourse,showAllCourses
}