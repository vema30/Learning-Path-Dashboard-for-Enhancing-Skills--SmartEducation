import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";  
import { configureStore } from "@reduxjs/toolkit"; // ✅ Import configureStore
import App from "./App";
import rootReducer from "./reducer/index"; // ✅ Ensure correct path
import "./index.css";

import { Toaster } from "react-hot-toast";

// Create Redux store
const store = configureStore({
  reducer: rootReducer,
  
});

// Create React root
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </Provider>
);
