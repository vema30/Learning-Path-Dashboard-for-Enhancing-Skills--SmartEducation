const Section = require("../models/Section");
const Course = require("../models/Course");

const createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newSection = await Section.create({ sectionName, courseId });

        // Update course and populate sections
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { sections: newSection._id } },
            { new: true }
        ).populate("sections");

        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            newSection,
            updatedCourse,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in creating section",
        });
    }
};

const updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in updating section",
        });
    }
};

const deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Remove the section from the course
        await Course.findByIdAndUpdate(courseId, {
            $pull: { sections: sectionId },
        });

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in deleting section",
        });
    }
};

// Export functions
module.exports = { createSection, updateSection, deleteSection };
