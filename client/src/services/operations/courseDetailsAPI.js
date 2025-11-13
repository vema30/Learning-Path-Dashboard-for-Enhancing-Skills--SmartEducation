import { toast } from "react-hot-toast";
import { updateCompletedLectures } from "../../slices/viewCourseSlice";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";
import axios from "axios"; // <-- Ensure axios is imported

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
} = courseEndpoints;

const baseURL = "http://localhost:4000/api/v1";

// Fetch all courses
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading courses...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) throw new Error("Could not fetch courses");
    result = response.data.data;
  } catch (error) {
    console.error("GET_ALL_COURSE_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch course details by ID

export const fetchCourseDetails = async (courseId, token) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("COURSE_DETAILS_API Error:", error);
    throw error;
  }
};
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axios.put(`baseURL/${courseId}`, courseData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.success) {
      throw new Error("Failed to update course");
    }

    return response.data; // Assuming response contains the updated course data
  } catch (error) {
    console.error("Error updating course:", error);
    throw error; // Re-throw the error for handling elsewhere
  }
};

// Fetch course categories
export const fetchCourseCategories = async (courseId) => {
  let result = [];
  try {
    const response = await axios.get(`${baseURL}/course/${courseId}`);
    if (!response?.data?.success || !Array.isArray(response.data.data)) {
      throw new Error("Invalid categories response");
    }
    result = response.data.data;
  } catch (error) {
    console.error("COURSE_CATEGORIES_API Error:", error);
    toast.error(error.message);
  }
  return result;
};

// Add course details
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Creating course...");
  let result = null;
  try {
    const response = await apiConnector("POST", `${baseURL}/createcourse`, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to create course");
    toast.success("Course created successfully");
    result = response.data.data;
  } catch (error) {
    console.error("CREATE_COURSE_API Error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Edit course
export const editCourseDetails = async (data, token) => {
  const toastId = toast.loading("Updating course...");
  let result = null;
  try {
    const response = await apiConnector("PUT", `${baseURL}/editCourse`, data, {
      "Content-Type": "multipart/form-data", // Adjust content type if necessary
      Authorization: `Bearer ${token}`,
    });
    
    // Check for success in the response
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update course");
    }

    // If successful, show success message
    toast.success("Course updated successfully");

    // Store the response data (if needed)
    result = response.data.data;
  } catch (error) {
    console.error("Error in editCourseDetails:", error);
    // Check if error.response is available (in case of network issues or invalid token)
    if (error.response) {
      console.error("Error Response:", error.response);
      toast.error(error.response.data?.message || error.message || "Unknown error occurred");
    } else {
      toast.error(error.message || "Unknown error occurred");
    }
  } finally {
    // Ensure the loading toast is dismissed
    toast.dismiss(toastId);
  }
  return result;
};

// Create section
export const createSection = async (data, token) => {
  const toastId = toast.loading("Creating section...");
  let result = null;
  try {
    const response = await apiConnector("POST", `${baseURL}/courses/${data.courseId}/sections`, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to create section");
    toast.success("Section created");
    result = response.data.updatedCourse;
  } catch (error) {
    console.error("CREATE_SECTION_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Create subsection
export const createSubSection = async (sectionId, data, token) => {
  const toastId = toast.loading("Creating lecture...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      `${baseURL}/sections/${sectionId}/subsections`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!response?.data?.success) throw new Error("Failed to add lecture");
    toast.success("Lecture added");
    result = response.data;
  } catch (error) {
    console.error("CREATE_SUBSECTION_API Error:", error);
    toast.error(error?.response?.data?.message || error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Update section
export const updateSection = async (data, token) => {
  const toastId = toast.loading("Updating section...");
  let result = null;
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to update section");
    toast.success("Section updated");
    result = response.data.data;
  } catch (error) {
    console.error("UPDATE_SECTION_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Update subsection
export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Updating lecture...");
  let result = null;
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to update lecture");
    toast.success("Lecture updated");
    result = response.data.data;
  } catch (error) {
    console.error("UPDATE_SUBSECTION_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete section
export const deleteSection = async (sectionId, token) => {
  const toastId = toast.loading("Deleting section...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", `http://localhost:4000/api/v1/sections/${sectionId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to delete section");
    toast.success("Section deleted");
    result = response.data.data;
  } catch (error) {
    console.error("DELETE_SECTION_API Error:", error);
    toast.error(error?.response?.data?.message || error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete subsection
export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Deleting lecture...");
  let result = null;
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to delete lecture");
    toast.success("Lecture deleted");
    result = response.data.data;
  } catch (error) {
    console.error("DELETE_SUBSECTION_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch instructor's courses
export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Fetching instructor courses...");
  let result = [];
  try {
    const response = await apiConnector("GET", `${baseURL}/instructor/courses`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to fetch instructor courses");
    result = response.data.courses;
  } catch (error) {
    console.error("FETCH_INSTRUCTOR_COURSES Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Deleting course...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API(data.courseId), null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to delete course");
    toast.success("Course deleted");
  } catch (error) {
    console.error("DELETE_COURSE_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

// Get full course details (authenticated)
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Fetching full course details...");
  let result = null;
  try {
    const response = await apiConnector("POST", GET_FULL_COURSE_DETAILS_AUTHENTICATED, { courseId }, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    console.error("GET_FULL_COURSE_DETAILS Error:", error);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
// Mark lecture as complete
export const markLectureAsComplete = async ({ courseId, subsectionId }, token) => {
  try {
    console.log("Request Data:", { courseId, subsectionId });

    const response = await apiConnector("POST", `${baseURL}/mark-lecture-complete`, { courseId, subsectionId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking lecture complete:", error);
    throw error;
  }
};
// Create course rating
export const createRating = async (data, token) => {
  const toastId = toast.loading("Submitting rating...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error("Failed to submit rating");
    toast.success("Rating submitted");
    success = true;
  } catch (error) {
    console.error("CREATE_RATING_API Error:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};
