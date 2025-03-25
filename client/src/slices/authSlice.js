import { createSlice } from "@reduxjs/toolkit";
const getTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      return JSON.parse(token); // Parse the token if it exists
    }
  } catch (error) {
    console.error("Failed to parse token from localStorage:", error);
  }
  return null; // Fallback to null if parsing fails or token doesn't exist
};


const initialState = {
  signupData: null,
  loading: false,
   token: getTokenFromLocalStorage(), 
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;