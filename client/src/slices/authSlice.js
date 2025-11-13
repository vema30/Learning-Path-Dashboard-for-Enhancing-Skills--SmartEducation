import { createSlice } from "@reduxjs/toolkit";

// Utility function to get token from localStorage
const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  return token ? token : null; // Return as a string
};

const initialState = {
  signupData: null,
  loading: false,
  token: getTokenFromLocalStorage(), // Get token on initial state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Persist token on state update
      console.log("Token set:", action.payload); // Debug log
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
