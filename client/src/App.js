import React from 'react'
import { Route, Routes } from "react-router"
import HomePage from './components/pages/HomePage';
import { Navbar } from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/common/Login';
import PasswordReset from './components/common/ResetPassword'
import SignupForm from './components/core/Auth/SignupForm';
import CheckEmail from './components/common/CheckEmail';
import {NewPassword} from './components/common/NewPassword';
import VerifyEmail from './components/common/VerifyEmail';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import Dashboard from './components/pages/Dashboard';
import ForgetPassword from './components/common/ForgetPassword';
import ResetPassword from './components/common/ResetPassword';
import MyProfile from './components/core/Dashboard/MyProfile';
const App = () => {
  return (
    <div className='flex flex-col w-screen min-h-screen bg-richblue-900 text-white  justify-between' >
        <Navbar/>
       
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/about-us' element={<AboutUs/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/MyProfile' element={<MyProfile/>}></Route>
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password/:token" element={<ResetPassword />} />
      </Routes>
      
      <Footer/>
      
    </div>
  )
}
//36-907
export default App;