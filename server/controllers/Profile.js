const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")
const moment = require("moment");
const Course = require("../models/Course")
const User = require("../models/User")

const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")




exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you are using JWT authentication
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses", // Populate courses for the user
        populate: {
          path: "sections", // Populate sections for each course
          populate: {
            path: "subSections", // Populate subSections for each section
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();
    let subsectionLength = 0;

    // Loop through each course to calculate total duration and progress
    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      subsectionLength = 0;

      for (let j = 0; j < userDetails.courses[i].sections.length; j++) {
        // Calculate total duration for the course
        totalDurationInSeconds += userDetails.courses[i].sections[j].subSections.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        // Count total subSections in the course
        subsectionLength += userDetails.courses[i].sections[j].subSections.length;
      }

      // Calculate progress percentage
      const courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      const completedVideos = courseProgressCount?.completedVideos.length || 0;

      // If no subSections, assume 100% progress
      if (subsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage = Math.round(
          (completedVideos / subsectionLength) * 100 * multiplier
        ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Check if req.user exists (set by auth middleware)
    if (!req.user) {
      console.log("req.user is undefined");
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user.id;
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;

    console.log("User ID from token:", userId);

    // Find user with populated profile
    const user = await User.findById(userId).populate("additionalDetails");

    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If no profile exists, create one
    let profile = user.additionalDetails;
    if (!profile) {
      profile = await Profile.create({
        gender: "",
        dateOfBirth: "",
        about: "",
        contactNumber: ""
      });
      user.additionalDetails = profile._id;
      await user.save();
    }

    // Update User fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();

    // Update Profile fields
    if (dateOfBirth) profile.dateOfBirth = new Date(dateOfBirth);
    if (about) profile.about = about;
    if (contactNumber) profile.contactNumber = contactNumber;
    if (gender) profile.gender = gender;
    await profile.save();

    // Return updated data
    const updatedUser = await User.findById(userId).populate("additionalDetails");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails: updatedUser,
    });

  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload image to Cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    console.log("Uploaded Image:", image);

    // Update user's image field in DB
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image Updated Successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating display picture:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile picture",
      error: error.message,
    });
  }
};



exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
