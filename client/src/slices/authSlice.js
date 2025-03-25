import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error("Failed to parse token from localStorage:", error);
    return null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getTokenFromLocalStorage(),
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
      localStorage.setItem("token", JSON.stringify(action.payload)); // Persist token on state update
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
