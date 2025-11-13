import React from 'react';
import { toast } from "react-hot-toast";
import { apiConnector } from '../apiconnector';

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  
  try {
    const response = await apiConnector(
      "POST",
      'http://localhost:4000/api/v1/course/categories1',
      { categoryId }
    );

    console.log("Response:", response);

    if (!response?.data?.success) {
      throw new Error("Could not fetch Category page data.");
    }

    result = response?.data; // Only assign if success
  } catch (error) {
    console.log("API Error:", error);
    
    // Handle network or response errors separately
    const errorMessage = error?.response?.data?.message || error.message || "An error occurred.";
    toast.error(errorMessage);

    result = error?.response?.data || {}; // Return empty object if no specific response
  }
  
  toast.dismiss(toastId);  // Always dismiss toast
  return result;
};
