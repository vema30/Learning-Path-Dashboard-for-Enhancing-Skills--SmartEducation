const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
// const uploadVideoToCloudinary = require("../utils/imageUploader"); // Assuming you have a utility for uploading
const { uploadFileToCloudinary } = require("../utils/uploadFile"); // Assuming you have a utility for uploading

// // Create SubSection
const createSubSection = async (req, res) => {
    try {
        const { title, sectionId, timeDuration, description } = req.body;
        console.log("📩 Received Body:", req.body);
        console.log("📂 Received Files:", req.files); // ✅ Debugging file upload

        if (!title || !sectionId || !timeDuration || !description || !req.files || !req.files.video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, including the video file!",
            });
        }

        const video = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video; // ✅ Get the first video
        console.log("🎥 Uploading video:", video.name);

        // Upload video to Cloudinary
        const uploadedDetails = await uploadFileToCloudinary(video, process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title,
            sectionId,
            timeDuration,
            description,
            videoUrl: uploadedDetails.secure_url,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSections: newSubSection._id } },
            { new: true }
        ).populate("subSections");

        return res.status(201).json({
            success: true,
            message: "SubSection created successfully",
            newSubSection,
            updatedSection,
        });
    } catch (e) {
        console.error("❌ Error creating subsection:", e);
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in creating SubSection",
        });
    }
};


// Update SubSection
const updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;

        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            { title, timeDuration, description },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            updatedSubSection,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in updating SubSection",
        });
    }
};

// Delete SubSection
const deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Remove the subsection reference from its parent section
        await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSections: subSectionId },
        });

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error in deleting SubSection",
        });
    }
};

// Export controllers
module.exports = { createSubSection, updateSubSection, deleteSubSection };
