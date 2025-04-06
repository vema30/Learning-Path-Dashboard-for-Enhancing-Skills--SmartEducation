import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';


export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      'http://localhost:4000/api/v1/course/categories1',
      {
        categoryId: categoryId,
      }
    
    )
    console.log("res",response);
    
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// export const getCatalogPageData = async(categoryId) => {
//   const toastId = toast.loading("Loading...");
//   let result = [];
//   try{
//         const response = await apiConnector("POST", "http://localhost:4000/api/v1/course/categories1", 
//         {categoryId: categoryId,});

//         if(!response?.data?.success)
//             throw new Error("Could not Fetch Category page data");

//          result = response?.data;

//   }
//   catch(error) {
//     console.log("CATALOG PAGE DATA API ERROR....", error);
//     toast.error(error.message);
//     result = error.response?.data;
//   }
//   toast.dismiss(toastId);
//   return result;
// }

// export const getCategoryDetails = async (catalogName) => {
//   try {
//     const response = await apiConnector("POST", "http://localhost:4000/api/v1/course/getCategoryPageDetails", {
//       catalogName,
//     })
//     if (!response?.data?.success) throw new Error("Failed to get category details")
//     return response.data.categoryDetails
//   } catch (error) {
//     console.error("GET CATEGORY DETAILS ERROR:", error)
//     throw error
//   }
// }

