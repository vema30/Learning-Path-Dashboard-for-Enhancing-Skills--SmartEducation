import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"
import axios from 'axios';

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}



export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating Profile...");

    // Check if the token exists
    if (!token) {
      toast.error("Authorization token is missing.");
      toast.dismiss(toastId);
      return;
    }

    try {
      console.log("Form Data Sent to API: ", formData);

      // Ensure the API request is properly formatted
      const isMultipart = formData instanceof FormData;

      // Use full URL with environment variable for the base URL
      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // For FormData, no need to set Content-Type, it is set automatically
            ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
          },
        }
      );

      console.log("UPDATE_PROFILE_API Response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Handling image if exists, or generating fallback image
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`;

      // Dispatch the updated user to the store
      dispatch(setUser({
        ...response.data.data,
        image: userImage,
        phoneNumber: response.data.data.phoneNumber, // Ensure phoneNumber is updated
        bio: response.data.data.bio, // Ensure bio is updated
        dateOfBirth: response.data.data.dateOfBirth // Ensure dateOfBirth is updated
      }));

      toast.success("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error Updating Profile:", error);

      // Handle errors more gracefully with more specific messages
      const errorMessage =
        error.response?.data?.message || error.message || "Could Not Update Profile. Please try again!";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId); // Ensure the toast is dismissed after the process
    }
  };
}


export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("PUT", "http://localhost:4000/api/v1/auth/change-password", formData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    // Check if response is successful
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unknown error occurred")
    }

    // Show success toast
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)

    // Enhanced error handling with more logging
    if (error.response) {
      // If error has a response object, handle it
      console.log("Error Response Data:", error.response)
      console.log("Error Response Status:", error.response.status)
      console.log("Error Response Headers:", error.response.headers)

      // Check if the error message exists in response
      const errorMessage = error.response?.data?.message || "An error occurred while changing password"
      toast.error(errorMessage)
    } else if (error.request) {
      // If error doesn't have a response (e.g., network error)
      console.log("Error Request Data:", error.request)
      toast.error("Network error: Please check your internet connection.")
    } else {
      // If error is related to the setup or something else
      console.log("Error Message:", error.message)
      toast.error(error.message || "An unexpected error occurred.")
    }
  } finally {
    // Ensure that toast dismiss happens after the request completes
    toast.dismiss(toastId)
  }
}


export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}