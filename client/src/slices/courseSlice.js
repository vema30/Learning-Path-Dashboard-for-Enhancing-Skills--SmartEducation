import { createSlice } from "@reduxjs/toolkit"

// Initial state of the course slice
const initialState = {
  step: 1, // Current step in the course creation process (1 = Course Info, 2 = Builder, 3 = Publish)
  course: null, // Holds the course object (data of the current course)
  editCourse: false, // Flag to check if the course is being edited
  paymentLoading: false, // Flag for payment processing status
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Updates the current step in the course process
    setStep: (state, action) => {
      state.step = action.payload
    },

    // Sets or updates the course data
    setCourse: (state, action) => {
      state.course = action.payload
    },

    // Toggles whether we are in the edit mode for a course
    setEditCourse: (state, action) => {
      state.editCourse = action.payload
    },

    // Sets the loading state for payment processing
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },

    // Resets all course-related state (e.g., after completing course creation)
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editCourse = false
      state.paymentLoading = false
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions

export default courseSlice.reducer
