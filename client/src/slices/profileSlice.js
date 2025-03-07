import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
    user:null,


}

// Create the authentication slice
const profileSlice = createSlice({
  name: "profile", // Unique name for the slice
  initialState, // Initial state for authentication
  reducers: {
    // Action to set the token in state and local storage
    setUser(state, action) {
      state.token = action.payload;
    
    }
    

  }
});

// Export actions to use them in components
export const { setToken, clearToken } = profileSlice.actions;

// Export reducer to be used in the Redux store
export default profileSlice.reducer;
