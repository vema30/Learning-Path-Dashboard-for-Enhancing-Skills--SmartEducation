  // Correct path to multer config
  require('dotenv').config();
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const cloudinary=require("../config/cloudinary");
const { uploadImageToCloudinary } = require("../utils/imageUploader")



const  createCourse = async (req, res) => {
    console.log("hhh")
    try {
       
      // Get user ID from request object
      const userId = req.user.id
  
      // Get all required fields from request body
      let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
      } = req.body
      // Get thumbnail image from request files
      const thumbnail = req.files.thumbnailImage
  
      // Convert the tag and instructions from stringified Array to Array
      const tag = JSON.parse(_tag)
      const instructions = JSON.parse(_instructions)
  
      console.log("tag", tag)
      console.log("instructions", instructions)
  
      // Check if any of the required fields are missing
      if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !thumbnail ||
        !category ||
        !instructions.length
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        })
      }
      if (!status || status === undefined) {
        status = "Draft"
      }
      // Check if the user is an instructor
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
      })
  
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        })
      }
  
      // Check if the tag given is valid
      const categoryDetails = await Category.findById(category)
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        })
      }
      
      // Upload the Thumbnail to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      // Create a new course with the given details
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail: thumbnailImage.secure_url,
        status: status,
        instructions,
      })
  
      // Add the new course to the User Schema of the Instructor
      await User.findByIdAndUpdate(
        {
          _id: instructorDetails._id,
        },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      // Add the new course to the Categories
      const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      console.log("HEREEEEEEEE", categoryDetails2)
      // Return the new course and a success message
      res.status(200).json({
        success: true,
        data: newCourse,
        message: "Course Created Successfully",
      })
    } catch (error) {
      // Handle any errors that occur during the creation of the course
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      })
    }
  }

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
