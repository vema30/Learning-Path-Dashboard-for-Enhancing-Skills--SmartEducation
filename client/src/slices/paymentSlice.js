// src/slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  orderDetails: null,
  verificationStatus: 'idle',
  verificationError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    paymentStart: (state) => {
      state.loading = true;
      state.error = null;
      state.orderDetails = null;
    },
    paymentSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    },
    paymentFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verificationStart: (state) => {
      state.verificationStatus = "pending";
      state.verificationError = null;
    },
    verificationSuccess: (state) => {
      state.verificationStatus = "success";
      state.verificationError = null;
    },
    verificationFailed: (state, action) => {
      state.verificationStatus = "failed";
      state.verificationError = action.payload;
    },
    resetPaymentState: () => initialState,
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    }
  },
});

export const {
  paymentStart,
  paymentSuccess,
  paymentFailed,
  verificationStart,
  verificationSuccess,
  verificationFailed,
  resetPaymentState,
  setOrderDetails
} = paymentSlice.actions;

export default paymentSlice.reducer;
