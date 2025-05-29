// controllers/recommendationController.js
const User = require("../models/User");
const Course = require("../models/Course");

exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Get the user and populate enrolled courses
    const user = await User.findById(userId).populate("courses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Extract tags/categories from purchased courses
    const purchasedCourseIds = user.courses.map(course => course._id);
    const purchasedTags = new Set();

    user.courses.forEach(course => {
      if (course.tags && course.tags.length > 0) {
        course.tags.forEach(tag => purchasedTags.add(tag));
      }
    });

    // 3. Find other courses matching the same tags, excluding already enrolled
    const recommendedCourses = await Course.find({
      _id: { $nin: purchasedCourseIds },
      tags: { $in: Array.from(purchasedTags) }
    }).limit(10);

    return res.json({ recommendedCourses });
  } catch (err) {
    console.error("Recommendation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
