// Import models
const Category = require("../models/Category"); // Assuming Category is the model for both categories and tags


// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
   console.log("name", name);
        console.log("description", description);
        // Validate input
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Category name and description are required",
            });
        }

        // Create the category
        const category = new Category({ name, description });
        await category.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Show all Categories
exports.showAllCategories = async (req, res) => {
  try {
      const categories = await Category.find({}, "name description"); // you can also pass projection as a string

      return res.status(200).json({
          success: true,
          message: "All categories fetched successfully",
          data: categories,
      });
  } catch (error) {
      console.error("Error fetching categories:", error); // Good practice to log server errors
      return res.status(500).json({
          success: false,
          message: "Something went wrong while fetching categories",
          error: error.message, // optionally you can send error.message
      });
  }
};
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      console.log()
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
  
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  

// exports.getCategoryDetailsByName = async (req, res) => {
//     try {
//         console.log("hey");
//       const { catalogName } = req.body;
//       console.log("catalogName:", catalogName);
  
//       if (!catalogName) {
//         return res.status(400).json({ success: false, message: "catalogName is required" });
//       }
       
//       const category = await Category.findOne({ name: catalogName });
  
//       if (!category) {
//         return res.status(404).json({ success: false, message: "Category not found" });
//       }
  
//       return res.status(200).json({
//         success: true,
//         categoryDetails: category,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Error fetching category",
//       });
//     }
//   };
  
  
// Category Page Details
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Find the selected category and populate related courses
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: `Category not found`,
            });
        }

        // Find different categories excluding the selected category
        const differentCategories = await Category.find({ _id: { $ne: categoryId } }).populate("courses").exec();

        return res.status(200).json({
            success: true,
            data: { selectedCategory, differentCategories },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
