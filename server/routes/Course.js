// Import required modules
const express = require("express");
const router = express.Router();
const uploadVideo = require("../middlewares/uploadVideo");

const upload = require('../middlewares/upload');  
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse, 
  updateCourseProgress
} = require("../controllers/Course");

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// Import Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Multer Configuration for File Uploads
// ********************************************************************************************************

// Ensure the "uploads/" directory exists

// ********************************************************************************************************
//                                      Course Routes
// ********************************************************************************************************

// Courses can only be created by Instructors
// Example: http://localhost:4000/api/v1/course/createCourse
router.post("/createCourse", auth, isInstructor, createCourse)
router.put('/editCourse',auth,isInstructor,editCourse);
// Add a Section to a Course
router.post("/courses/:courseId/sections", auth, isInstructor, createSection);

// Update a Section
router.put("/sections/:sectionId", auth, isInstructor, updateSection);

// Delete a Section
router.delete("/sections/:sectionId", auth, isInstructor, deleteSection);

// Edit Sub Section
router.put("/subsections/:subSectionId", auth, isInstructor, updateSubSection);

// Delete Sub Section
router.delete("/subsections/:subSectionId", auth, isInstructor, deleteSubSection);

// Add a Sub Section to a Section
// router.post("/sections/:sectionId/subsections", auth, isInstructor, createSubSection);
// router.post(
//   "/sections/:sectionId/subsections",
//   auth,
//   isInstructor,
//   uploadVideo.single("video"), // Ensure you're using uploadVideo, not upload
//   createSubSection
// );
// No need for `uploadVideo.single("video") i am using express-fileupload`
//
//
// add auth and instructure middleware
router.post(
  "/sections/:sectionId/subsections",
  
  createSubSection 
);

// Get all Registered Courses
router.get("/courses", showAllCourses);

// Get Details for a Specific Course
router.get("/courses/:courseId", getCourseDetails);

// Get Full Details for a Specific Course
router.get("/courses/:courseId/full-details", auth, getFullCourseDetails);

// Edit Course routes
router.put("/courses/:courseId", auth, isInstructor, editCourse);

// Get all Courses Under a Specific Instructor
router.get("/instructor/courses", auth, isInstructor, getInstructorCourses);

// Delete a Course
router.delete("/courses/:courseId", deleteCourse);
router.post("/course/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category Routes (Only by Admin)
// ********************************************************************************************************
router.post("/categories", auth, isAdmin, createCategory);
router.get("/categories", showAllCategories); 
router.post("/categories1", categoryPageDetails); 

router.get("/categories/:categoryId", categoryPageDetails);
///http://localhost:4000/api/v1/course/getCategoryPageDetails
// ********************************************************************************************************
//                                      Rating and Review Routes
// ********************************************************************************************************
router.post("/ratings", auth, isStudent, createRating);
router.get("/ratings/average", getAverageRating);
router.get("/ratings", getAllRating);

// Export the router
module.exports = router;
