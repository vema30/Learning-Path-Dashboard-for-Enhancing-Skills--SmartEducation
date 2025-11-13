import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalCompletedLectures: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload;
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload;
    },
    setTotalCompletedLectures: (state, action) => {
      state.totalCompletedLectures = action.payload;
    },
    
    updateCompletedLectures: (state, action) => {
      if (!state.completedLectures.includes(action.payload)) {
        state.completedLectures.push(action.payload);
      }
    },
  },
});

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalCompletedLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;
