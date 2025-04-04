import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import { Navbar } from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Login from "./components/common/Login";
import SignupForm from "./components/core/Auth/SignupForm";
import VerifyEmail from "./components/common/VerifyEmail";
import AboutUs from "./components/pages/AboutUs";
import Contact from "./components/pages/Contact";
import Dashboard from "./components/pages/Dashboard";
import ForgetPassword from "./components/common/ForgetPassword";
import ResetPassword from "./components/common/ResetPassword";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Settings from "./components/core/Dashboard/Settings/index";
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import CourseBuilderForm from "./components/core/Dashboard/AddCourse/CourseBuilder/CourseBuilderForm";

const App = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblue-900 text-white justify-between">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password/:token" element={<ResetPassword />} />

        {/* Private Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
