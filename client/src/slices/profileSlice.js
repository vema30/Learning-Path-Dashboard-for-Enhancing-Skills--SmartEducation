import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  additionalDetails: null, // Add additionalDetails to the state
  loading: false,
  error: null, // Add error handling if necessary
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAdditionalDetails(state, action) {
      state.additionalDetails = action.payload; // Store additional details
    },
    setError(state, action) {
      state.error = action.payload; // Store error message if needed
    }
  },
});

export const { setUser, setLoading, setAdditionalDetails, setError } = profileSlice.actions;
export default profileSlice.reducer;
