const BASE_URL = "https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login", // Fixed by adding BASE_URL
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payments/capturePayment", // Fixed by adding BASE_URL
  VERIFY_PAYMENT: BASE_URL + "/payments/verifyPayment", // Fixed by adding BASE_URL
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payments/sendPaymentSuccessEmail", // Fixed by adding BASE_URL
  CREATE_ORDER: BASE_URL + "/payments/order", // Fixed by adding BASE_URL
};

export const categoriesEndpoints = {
  CREATE_CATEGORY_API: BASE_URL + "/categories", // Fixed by adding BASE_URL
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/courses",
  COURSE_DETAILS_API: (courseId) => BASE_URL + `/course/${courseId}`, // Fixed by adding BASE_URL
  GET_COURSE_DETAILS: BASE_URL+"/course-details", // Add this

  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/courses/:courseId/sections",
  CREATE_SUBSECTION_API: BASE_URL + "/course/sections/:sectionId/subsections",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/sections/:sectionId",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: (courseId) => BASE_URL + `/course/courses/${courseId}`, // Fixed by adding BASE_URL

  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/categories", // Fixed by adding BASE_URL
};

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
  GET_CATEGORY_DETAILS_API: BASE_URL + "/course/getCategoryDetails", // ← New endpoint
};

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

// SETTINGS PAGE API    api/v1/profile
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};
