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
import InstructorTests from "./components/pages/Tests/InstructorTests";
import Cart from "./components/core/Dashboard/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Settings from "./components/core/Dashboard/Settings/index";
import EditTest from "./components/pages/Tests/EditTest";
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import CreateCategory from './components/core/Dashboard/CreateCategory'
import Articles from './components/common/Articles/index';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';
import Index from './components/common/tests/index'
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
import EditCourse from "./components/core/Dashboard/EditCourse";
import CreateCategoryTests from "./components/pages/Tests/createCategory";
import CreateTests from "./components/pages/Tests/CreateTests";
import MyTests from './components/pages/Tests/MyTests'
import TestDetails from './components/pages/Tests/TestDetails'
import TestResult from './components/pages/Tests/TestResult'
import QuizDetails from "./components/pages/Tests/QuizDetails";
import Chatbot from "./components/Chatbot";
const App = () => { 
   const { user } = useSelector((state) => state.profile)
   console.log("hi",user?.accountType, ACCOUNT_TYPE.STUDENT);


  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblue-900 text-white justify-between">
    
      <Navbar />
      
      
     {/* { <Recommendation/>} */}
     
     

      <Routes>
      <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />

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
        <Route path="/Articles" element={<Articles/>}></Route>
        <Route path="/tests" element={<MyTests/>}></Route>
        <Route path="/tests/create-category" element={<CreateCategoryTests/>}></Route>
        <Route path="/tests/create-tests" element={<CreateTests/>}></Route>
        <Route path="/testdetails" element={<TestDetails/>}/>
        <Route path="/test-result" element={<TestResult/>}></Route>
        <Route path="/quiz/:id" element={<QuizDetails/>}></Route>
        <Route path="/edit-test/:testId" element={<EditTest/>}></Route>
        <Route path="/test-mine" element={<InstructorTests/>}></Route>
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
          
          <Route path="create-category" element={<CreateCategory/>} />
          <Route path="my-courses" element={<MyCourses/>} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          <Route path="instructor" element={<Instructor />} />
        </Route>
      </Routes>
       
      <Footer />
     
    </div>
  );
};

export default App;
