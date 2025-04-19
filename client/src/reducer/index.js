import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import cartReducer from '../slices/cartSlice';
import courseReducer from '../slices/courseSlice';  // Import the course reducer
import viewCourseReducer from '../slices/viewCourseSlice'
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  course: courseReducer,  // Add the course reducer here
  viewCourse: viewCourseReducer
});

export default rootReducer;
