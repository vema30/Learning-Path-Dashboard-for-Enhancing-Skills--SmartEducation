require("dotenv").config();
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Controller to create a new course
const createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, category, price } = req.body;
        const thumbnail = req.files?.thumnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !category || !price || !thumbnail) {
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

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Upload thumbnail image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create the course
        const course = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            instructor: instructorDetails._id,
            category: categoryDetails._id
        });

        // Update the category with the new course
        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: { courses: course._id }
        }, { new: true });

        // Update the instructor with the new course
        await User.findByIdAndUpdate(instructorDetails._id, {
            $push: { courses: course._id }
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
};

// Controller to fetch all courses
const showAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate("instructor", "firstName lastName email")
            .populate("category", "name description");

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

// Controller to fetch specific course details
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate("instructor", "firstName lastName email")
            .populate("category", "name description")
            .populate("ratingAndreviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Course not found with ID ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error fetching course details",
        });
    }
};

// Controller to get full course details, including instructor, course content, and reviews
const getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate("instructor", "firstName lastName email")
            .populate("category", "name description")
            .populate("ratingAndreviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Course not found with ID ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Full course details fetched successfully",
            data: courseDetails,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error fetching full course details",
        });
    }
};

// Controller to edit course details
const editCourse = async (req, res) => {
    try {
        const { courseId, courseName, courseDescription, whatYouWillLearn, price, category } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if (courseName) course.courseName = courseName;
        if (courseDescription) course.courseDescription = courseDescription;
        if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;
        if (price) course.price = price;
        if (category) course.category = category;

        await course.save();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

// Controller to fetch courses by instructor
const getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await Course.find({ instructor: instructorId })
            .populate("category", "name description");

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this instructor",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Instructor's courses fetched successfully",
            courses,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

// Controller to delete a course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        await Course.findByIdAndDelete(courseId);

        // Remove the course from the instructor's list
        await User.findByIdAndUpdate(course.instructor, {
            $pull: { courses: courseId },
        });

        // Remove the course from the category's list
        await Category.findByIdAndUpdate(course.category, {
            $pull: { courses: courseId },
        });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

module.exports = {
    createCourse,
    showAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse
};
