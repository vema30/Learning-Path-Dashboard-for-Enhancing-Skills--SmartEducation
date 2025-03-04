// Import models
const Category = require("../models/Category"); // Assuming Category is the model for both categories and tags

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

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
        const categories = await Category.find({}, { name: true, description: true });

        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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
