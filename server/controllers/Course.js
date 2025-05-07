  // Correct path to multer config
  
  require('dotenv').config();
  const CourseProgress = require("../models/CourseProgress");

const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const cloudinary=require("../config/cloudinary");
// const { uploadImageToCloudinary } = require("../utils/imageUploader")

const {uploadImageToCloudinary}=require("../utils/imageUploader");

const  createCourse = async (req, res) => {
    //console.log("hhh")
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
      const thumbnail = req.files.thumbnailImage;
      // Convert the tag and instructions from stringified Array to Array
      const tag = JSON.parse(_tag)
      const instructions = JSON.parse(_instructions)
  
      // console.log("tag", tag)
      // console.log("instructions", instructions)
      console.log("thumbnail", thumbnail)
  
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
      let thumbnailImage;
     try{
      thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
    }
      catch(e)
      {
        console.log("e",e.message);
        console.log("error in uploading image to cloudinary");
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail image",
          error: e.message,
        })
      }
     

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
      const courseId = req.params.courseId;
  
      const courseDetails = await Course.findOne({ _id: courseId })
        .populate("instructor", "firstName lastName email")
        .populate("category", "name description")
        .populate("ratingAndReview")
        .populate({
          path: "sections",
          populate: {
            path: "subSections", // ✅ corrected
          },
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
      console.log("e", e.message);
      return res.status(500).json({
        success: false,
        message: "Error fetching course details",
      });
    }
  };
  

const getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.params; // Use req.params if you're calling this via route /courses/:courseId
  
      const courseDetails = await Course.findById(courseId)
        .populate("instructor", "firstName lastName email")
        .populate("category", "name description")
        .populate("ratingAndReview")
        .populate("studentsEnrolled")

        .populate({
            path: "sections",
            populate: {
              path: "subSections", // ✅ correct
              model: "SubSection"
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
      console.error("Error:", e);
      return res.status(500).json({
        success: false,
        message: "Error fetching full course details",
      });
    }
  };
  
  
// Controller to edit course details
const editCourse = async (req, res) => {
 console.log("hereee haree rammaaa")
    try {
        const { courseId, courseName, courseDescription, whatYouWillLearn, price, category } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Ensure only the instructor who created the course can edit
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this course",
            });
        }

        // Update course fields dynamically
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { courseName, courseDescription, whatYouWillLearn, price, category },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: {
                _id: updatedCourse._id,
                courseName: updatedCourse.courseName,
                courseDescription: updatedCourse.courseDescription,
                whatYouWillLearn: updatedCourse.whatYouWillLearn,
                price: updatedCourse.price,
                category: updatedCourse.category,
            },
        });
        
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }

};


const getInstructorCourses = async (req, res) => {
  try {
      // Ensure that the user ID (instructor) is extracted correctly
      const instructorId = req.user?.id; // `req.user` should be set by the authentication middleware
      if (!instructorId) {
          return res.status(400).json({
              success: false,
              message: "Instructor ID is required", // Return an error if the instructor ID is not found
          });
      }

      console.log("Instructor ID:", instructorId); // Debugging line to verify the instructor ID

      // Query to fetch the courses where instructor ID matches
      const courses = await Course.find({ instructor: instructorId })
          .populate("category", "name description")
          .populate("studentsEnrolled")
 // Populate Category field with name and description
          .exec(); // Execute the query
   console.log("courses",courses);
      // If no courses are found for the instructor
      if (!courses || courses.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No courses found for this instructor", // Return a message if no courses found
          });
      }

      // If courses are found, return them in the response
      return res.status(200).json({
          success: true,
          message: "Instructor's courses fetched successfully", // Success message
          courses, // Return the courses data
      });
  } catch (error) {
      // Log and handle any errors that occur during the process
      console.error("Error fetching instructor courses:", error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error", // General error message
          error: error.message, // Return the error message for debugging
      });
  }
};



// Controller to delete a course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("🔍 Course ID:", courseId);

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ Course not found");
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    console.log("✅ Course found:", course.courseName);

    // Delete Sections & SubSections
    for (const sectionId of course.courseContent || []) {
      console.log("🧹 Deleting Section:", sectionId);
      const section = await Section.findById(sectionId);

      if (section) {
        for (const subId of section.subSections || []) {
          const subSection = await SubSection.findById(subId);
          console.log("📹 SubSection:", subId, "Video:", subSection?.video?.public_id);

          if (subSection?.video?.public_id) {
            await cloudinary.uploader.destroy(subSection.video.public_id, {
              resource_type: "video",
            });
            console.log("✅ Deleted video from Cloudinary:", subSection.video.public_id);
          }
        }

        await SubSection.deleteMany({ _id: { $in: section.subSections } });
        await Section.findByIdAndDelete(sectionId);
        console.log("🧽 Deleted section and its subsections");
      }
    }

    // Delete thumbnail
    if (course.thumbnail?.public_id) {
      console.log("course.thumbnail?.public_id)",course.thumbnail?.public_id);
      await cloudinary.uploader.destroy(course.thumbnail.public_id, {
        resource_type: "image",
      });
      console.log("🖼️ Deleted course thumbnail from Cloudinary");
    }

    // Delete course
    await Course.findByIdAndDelete(courseId);
    console.log("🗑️ Course deleted from DB");

    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });

    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course and associated data deleted successfully",
    });
  } catch (e) {
    console.error("❌ Error deleting course:", e);
    return res.status(500).json({
      success: false,
      message: e.message || "Server error while deleting course",
    });
  }
};


// Controller to update user's course progress


// const updateCourseProgress = async (req, res) => {
//   const { courseId, subsectionId } = req.body;
//   console.log("courseID",courseId);
//   console.log("course id, section ID", courseId, subsectionId);

//   const userId = req.user.id;  // Assuming user ID is available from authentication middleware

//   try {
//     // Fetch the course by ID and populate both 'sections' and 'sections.subSections'
//     const course = await Course.findById(courseId)
//       .populate({
//         path: 'sections',
//         populate: {
//           path: 'subSections'
//         }
//       });

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Validate if the sections and subSections exist
//     if (!course.sections || !Array.isArray(course.sections)) {
//       return res.status(400).json({ message: 'Course sections data is missing or malformed' });
//     }

//     // Try to find the section that contains the subsection
//     let subsectionFound = false;
//     const section = course.sections.find((sec) => {
//       // Check if the section contains subSections and if subsectionId is present in the subSections
//       if (Array.isArray(sec.subSections)) {
//         return sec.subSections.some((sub) => sub._id.toString() === subsectionId);
//       }
//       return false;  // No subSections found in this section
//     });

//     // If no section or subsection is found
//     if (!section) {
//       console.log("Section or Subsection not found");
//       return res.status(404).json({ message: 'Subsection not found in course' });
//     }

//     // Now, find the actual subsection inside the section
//     const subsection = section.subSections.find((sub) => sub._id.toString() === subsectionId);
//     if (!subsection) {
//       return res.status(404).json({ message: 'Subsection not found' });
//     }

//     // Fetch the user data and check if the subsection is already completed
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Ensure completedLectures is always an array
//     if (!user.completedLectures) {
//       user.completedLectures = [];
//     }

//     // Check if the lecture has already been marked as completed
//     if (user.completedLectures.includes(subsectionId)) {
//       return res.status(400).json({ message: 'Lecture already completed' });
//     }

//     // Add subsection to user's completed lectures
//     user.completedLectures.push(subsectionId);
//     await user.save();

//     // Optionally, update the course progress based on completed lectures
//     course.totalCompletedLectures = course.sections.reduce((acc, sec) => {
//       return acc + sec.subSections.filter((sub) =>
//         user.completedLectures.includes(sub._id.toString())
//       ).length;
//     }, 0);
//     await course.save();
//           console.log("courser",course);
//     return res.status(200).json({
//       message: 'Course progress updated successfully',
//       completedLectures: user.completedLectures,
//       totalCompletedLectures: course.totalCompletedLectures,
//     });

//   } catch (error) {
//     console.error('Error updating course progress:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// const Course = require("../models/Course"); // Assuming the Course model is imported
// const User = require("../models/User"); // Assuming the User model is imported
const updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;
console.log("jjhbhjbjh")

  try {
    // Fetch the course
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    });
    // course.courseProgress=100;
    console.log("course",course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("gvhhgvhg")
    // Check if the subsection exists
    const subsectionExists = course.sections.some((section) =>
      section.subSections.some((sub) => sub._id.toString() === subsectionId)
    );

    if (!subsectionExists) {
     // return res.status(404).json({ message: "Subsection not found in course" });
    }

    // Find or create the CourseProgress record
    let progress = await CourseProgress.findOne({ userId, courseId });

    // if (!progress) {
    //   // Create a new progress record if it doesn't exist
    //   progress = await CourseProgress.create({
    //     userId,
    //     courseId,
    //     completedSubsections: [subsectionId],
    //   });

    //   // Set the courseProgress field to reference the newly created progress
    //   course.courseProgress = progress._id;
    //   await course.save();
    // } else {
    //   // If progress exists, update the completed subsections
    //   if (progress.completedSubsections.includes(subsectionId)) {
    //     return res.status(400).json({ message: "Subsection already completed" });
    //   }

    //   progress.completedSubsections.push(subsectionId);
    //   await progress.save();
    // }
    if (!progress) {
      progress = await CourseProgress.create({
        userId,
        courseId,
        completedVideos: [subsectionId], // not completedSubsections
      });
    } else {
      if (progress.completedVideos.includes(subsectionId)) {
        console.log("heyy",progress)
   //     return res.status(400).json({ message: "Subsection already completed" });
      }
    
      progress.completedVideos.push(subsectionId); // not completedSubsections
      await progress.save();
    }
    console.log("heyy",progress)
    const completedCount = progress.completedVideos.length;
    
   console.log("completedCount",completedCount)
    // Calculate the progress percentage
    const allSubSections = course.sections.flatMap((section) =>
      section.subSections.map((sub) => sub._id.toString())
    );
    console.log("completed",allSubSections);
   // const completedCount = progress.completedSubsections.length;
    const totalCount = allSubSections.length;
    console.log("totalCount",totalCount);
    const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    console.log("progressPercentage",progressPercentage)
 //   course.progressPercentage=courseProgress;
    courseProgress=progressPercentage;
    console.log("c",course);
    return res.status(200).json({
      message: "Course progress updated successfully",
      completedSubsections: progress.completedSubsections,
      progressPercentage,
    });
    
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



//module.exports = { updateCourseProgress };


module.exports = {
    createCourse,
    showAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    updateCourseProgress
};
