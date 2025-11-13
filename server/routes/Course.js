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
  updateCourseProgress,markLectureAsComplete
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
// Endpoint to refresh the access token
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).send("Refresh token required");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // or any expiration time you prefer
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).send("Invalid refresh token");
  }
});

router.post("/createCourse", auth, isInstructor, createCourse)
router.put('/editCourse',auth,isInstructor,editCourse);
// Add a Section to a Course
router.post("/courses/:courseId/sections", auth, isInstructor, createSection);

// Update a Section
router.put("/sections/:sectionId", auth, isInstructor, updateSection);

// Delete a Section
router.delete("/sections/:sectionId", auth, isInstructor, deleteSection);
router.put('/updateCourseProgress', updateCourseProgress);

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

// Get Details for a Specific Course

// Get Full Details for a Specific Course

// Edit Course routes

// Get all Courses Under a Specific Instructor
router.get("/instructor/courses", auth, isInstructor, getInstructorCourses);
// For updating a section
router.post("/updateSection",auth, updateSection);

router.post("/mark-lecture-complete", auth, isStudent, markLectureAsComplete);


// Delete a Course

// ********************************************************************************************************
//                                      Category Routes (Only by Admin)
// ********************************************************************************************************
router.post("/categories", createCategory);
router.get("/categories", showAllCategories); 
router.post("/categories1", categoryPageDetails); 

router.get("/categories/:categoryId",auth, categoryPageDetails);
router.get("/courses",auth, showAllCourses);
router.get("/:courseId", auth, getFullCourseDetails);
router.put("/courses/:courseId", auth, isInstructor, editCourse);
router.delete("/courses/:courseId",auth, deleteCourse);

router.post("/courses/editCourse",auth, editCourse);
router.post("/course/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Add a Section to a Course
router.post("/courses/:courseId/sections", auth, isInstructor, createSection);

// Now dynamic route at LAST
router.get("/:courseId",auth, getCourseDetails);

///http://localhost:4000/api/v1/course/getCategoryPageDetails
// ********************************************************************************************************
//                                      Rating and Review Routes
// ********************************************************************************************************
router.post("/ratings", auth, isStudent, createRating);
router.get("/ratings/average", getAverageRating);
router.get("/ratings", getAllRating);

// Export the router
module.exports = router;
