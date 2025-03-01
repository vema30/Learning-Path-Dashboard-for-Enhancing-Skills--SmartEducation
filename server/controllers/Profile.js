const Profile = require("../models/Profile");
const User = require("../models/User");

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        const userId = req.user.id;

        if (!userId || !contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Fetch user details
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get Profile ID and update
        const profileId = userDetails.additionalDetails;
        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { dateOfBirth, about, contactNumber, gender },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedProfile,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error updating profile",
        });
    }
};

// Delete User Account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete associated profile
        const profileId = user.additionalDetails;
        if (profileId) {
            await Profile.findByIdAndDelete(profileId);
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error deleting account",
        });
    }
};

// Get All Users with Profiles
const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const users = await User.findById(id).populate("additionalDetails").exec();

        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message,
            message: "Error fetching users",
        });
    }
};

// Export controllers
module.exports = { updateProfile, deleteAccount, getAllUserDetails };
