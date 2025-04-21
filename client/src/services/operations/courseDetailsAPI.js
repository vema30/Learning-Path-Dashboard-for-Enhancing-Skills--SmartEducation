import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")

  console.log("courseid",courseId);
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector("get", `http://localhost:4000/api/v1/course/courses/${courseId}`, {
      courseId,
    })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.
        data.message)
    }
    result = response.data
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// fetching the available course categories
// export const fetchCourseCategories = async () => {
//   let result = []
//   try {
//     const response = await apiConnector("GET", COURSE_CATEGORIES_API)
//     console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Course Categories")
//     }
//     result = response?.data?.data
//   } catch (error) {
//     console.log("COURSE_CATEGORY_API API ERROR............", error)
//     toast.error(error.message)
//   }
//   return result
// }
export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", "http://localhost:4000/api/v1/course/categories");

    console.log("COURSE_CATEGORIES_API API RESPONSE............", response)

    // Make sure the response has the expected structure
    if (response?.data?.success && Array.isArray(response?.data?.data)) {
      result = response?.data?.data
    } else {
      throw new Error("Invalid data structure or no categories found.")
    }
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// export const fetchCourseCategories = async () => {
//   let result = [];
//   try {
//     const response = await apiConnector("GET", "https://localhost:4000/api/v1/course/categories");

//     // Log the response to confirm its structure
//     console.log("COURSE_CATEGORIES_API API RESPONSE............", response);

//     // Check if the response structure is correct
//     if (response?.data?.success && Array.isArray(response?.data?.data)) {
//       result = response?.data?.data;
//     } else {
//       throw new Error("Invalid data structure or no categories found.");
//     }
//   } catch (error) {
//     console.log("COURSE_CATEGORY_API API ERROR............", error);
//     toast.error(error.message || "An error occurred while fetching categories");
//   }
//   return result;
// }

// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  console.log("CREATE_COURSE_API", CREATE_COURSE_API);
  console.log("token in addcoursedetails",token);
   console.log("hmm token",token);
  try {
    const response = await apiConnector("POST", "http://localhost:4000/api/v1/course/createcourse", data, {
      Authorization: `Bearer ${token}`,
    });
    
    

    console.log("CREATE COURSE API RESPONSE............", response);

    // Check the response structure; ensure the API returns a success field in data
    if (!response?.data?.success) {
      console.log("response",);
      throw new Error("Could Not Add Course Details");
    }

    toast.success("Course Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);

    // Log full error details
    if (error.response) {
      console.log("Error Response:", error.response);
      toast.error(`Error: ${error.response.data?.message || 'An error occurred'}`);
    } else {
      toast.error("There was an error with your request. Please try again.");
    }
  } finally {
    // Ensure that the loading toast is dismissed in any case
    toast.dismiss(toastId);
  }

  return result;
};


// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PUT", 'http://localhost:4000/api/v1/course/editCourse', data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,

    })
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
    return false;
  }
  toast.dismiss(toastId)
  return true;
}

// create a section
export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  if (!data?.courseId) {
    toast.error("Course ID is missing");
    toast.dismiss(toastId);
    return null;
  }

  let CREATE_SECTION_API1 = `http://localhost:4000/api/v1/course/courses/${data.courseId}/sections`;
  let response=null;
  try { 
    console.log("API Endpoint:", CREATE_SECTION_API1);

     response= await apiConnector("POST", CREATE_SECTION_API1, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE SECTION API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }

    toast.success("Course Section Created");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.log("CREATE SECTION API ERROR:", error.message);
    toast.error(error.message || "Error creating section");
  }

  toast.dismiss(toastId);
  return result;
};


// create a subsection
export const createSubSection = async (sectionId, data, token) => {
  let result = null;
  const toastId = toast.loading("Creating Lecture...");

  try {
    // ✅ Check if sectionId exists
    if (!sectionId) {
      throw new Error("Section ID is required to create a subsection.");
    }
    console.log("token",token);

    console.log("SECTION ID:", sectionId);
    console.log("DATA BEFORE API CALL:", data);

    const CREATE_SUBSECTION_API = `http://localhost:4000/api/v1/course/sections/${sectionId}/subsections`;

    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      headers: {
        Authorization: `Bearer ${token}`,
       
      },
    });

    console.log("CREATE SUB-SECTION API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Add Lecture");
    }

    toast.success("Lecture Added Successfully 🎉");
    result = response?.data;
  } catch (error) {
    console.error("❌ CREATE SUB-SECTION API ERROR:", error);
    toast.error(error.response?.data?.message || error.message);
  }

  toast.dismiss(toastId);
  return result;
};



// update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
export const deleteSection = async (sectionId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  console.log("sectionid",sectionId);
  // Correct API URL matching backend
  const DELETE_SECTION_API = `http://localhost:4000/api/v1/sections/${sectionId}`;

  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("DELETE SECTION API RESPONSE:", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }

    toast.success("Course Section Deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE SECTION API ERROR:", error);
    toast.error(error.response?.data?.message || "An error occurred");
  }

  toast.dismiss(toastId);
  return result;
};

// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = []
  console.log("fecting inststure details")
  const toastId = toast.loading("Loading...")
  try {

    const GET_ALL_INSTRUCTOR_COURSES_API1= "http://localhost:4000/api/v1/course/instructor/courses"
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API1 ,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    
    result = response?.data?.courses
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_COURSE_API(data.courseId),
      null,
      { Authorization: `Bearer ${token}` }
    );
  
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Marking lecture as complete...");

  try {
    console.log("➡️ markLectureAsComplete - Request data:", data);

    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("✅ markLectureAsComplete - API response:", response);

    if (response?.data?.success) {
      toast.success("Lecture marked as complete ✅");
      result = true;
    } else {
      throw new Error(response?.data?.message || "Something went wrong");
    }
  } catch (error) {
    console.error("❌ markLectureAsComplete - Error:", error);
    toast.error(error?.response?.data?.message || error.message);
    result = false;
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};


// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}