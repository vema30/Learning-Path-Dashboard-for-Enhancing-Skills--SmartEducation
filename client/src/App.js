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
import CreateCategory from './components/core/Dashboard/CreateCategory'
//import CourseDetailPage from "./components/pages/CourseDetailPage";
import CourseDetails from "./components/pages/CourseDetails";
//import CourseBuilderForm from "./components/core/Dashboard/AddCourse/CourseBuilder/CourseBuilderForm";
import MyCourses from './components/core/Dashboard/MyCourses'
import Catalog from "./components/pages/Catalog";
// import Recommendation from "./helper/Recommendation";
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import { getUserDetails } from "./services/operations/profileAPI";
import { ACCOUNT_TYPE } from "./utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import   Recommendation from './helper/Recommendation'
import EditCourse from "./components/core/Dashboard/EditCourse";  // Adjust path if necessary
import PaymentPage from "./components/pages/paymentpage";
import BlogPage from "./components/pages/BlogPage";
import BlogDetails from "./components/pages/BlogDetails";
import CreateBlog from "./components/pages/CreateBlog";
import EditBlogPage from "./components/pages/EditBlogPage";
import QuizDetails from "./components/pages/tests/QuizDetails";
import CreateTests from "./components/pages/tests/CreateTests";
import MyTests from "./components/pages/tests/MyTests";
import TestResult from "./components/pages/tests/TestResult";
//import TestDetails from "./components/pages/TestDetails";
import CreateCategory1 from "./components/pages/tests/createCategory";
const App = () => { 
   const { user } = useSelector((state) => state.profile)
   console.log("hi",user?.accountType, ACCOUNT_TYPE.STUDENT);


  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblue-900 text-white justify-between">

      <Navbar />
    
      
   {/* <Recommendation/>*/}
     
     

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password/:token" element={<ResetPassword />} />
        <Route path="/catalog/:catalogName" element={<Catalog/>}/>
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<EditBlogPage />} />
        <Route path="/payments/:courseId" element={<PaymentPage />} />
        <Route path="/tests" element={<MyTests />} />
        <Route path="/quiz/:id" element={<QuizDetails />} />
        <Route path="/test-result" element={<TestResult />} />
        <Route path="/create-test" element={<CreateTests />} />
        <Route path="/create-category" element={<CreateCategory1 />} />

        {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}

        {/* Private Dashboard Route */}
        <Route
          path="/dashboard/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="settings" element={<Settings />} />

          <Route path="create-category" element={<CreateCategory/>} />
          <Route path="my-courses" element={<MyCourses/>} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          <Route path="edit-course/:courseId" element={<EditCourse />} />

        </Route>
      </Routes>
       
      <Footer />
    </div>
  );
};

export default App;
