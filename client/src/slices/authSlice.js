import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  // Retrieve the token from local storage if it exists, otherwise set it to null
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

// Create the authentication slice
const authSlice = createSlice({
  name: "auth", // Unique name for the slice
  initialState, // Initial state for authentication
  reducers: {
    // Action to set the token in state and local storage
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload)); // Save token to local storage
    },
    
    // Action to clear the token from state and remove it from local storage
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token"); // Remove token from local storage
    }
  }
});

// Export actions to use them in components
export const { setToken, clearToken } = authSlice.actions;

// Export reducer to be used in the Redux store
export default authSlice.reducer;
