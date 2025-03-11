import React from 'react'
import { Route, Routes } from "react-router"
import HomePage from './components/pages/HomePage';
import { Navbar } from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/common/Login';
import PasswordReset from './components/common/ResetPassword'
import { Signup } from './components/common/Signup';
import CheckEmail from './components/common/CheckEmail';
import {NewPassword} from './components/common/NewPassword';
import VerifyEmail from './components/common/VerifyEmail';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
const App = () => {
  return (
    <div className='flex flex-col w-screen min-h-screen bg-richblue-900 text-white  justify-between' >
        <Navbar/>
        {/* {<CheckEmail/>} */}
        {/* <NewPassword/> */}
        {/* <VerifyEmail/> */}
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/about-us' element={<AboutUs/>}></Route>
        <Route path='/forgot-password' element={<PasswordReset/>}></Route>
      </Routes>
      
      <Footer/>
      
    </div>
  )
}
//36-907
export default App;