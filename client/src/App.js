import React from 'react'
import { Route, Routes } from "react-router"
import HomePage from './components/pages/HomePage';
import { Navbar } from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/common/Login';
import PasswordReset from './components/common/ResetPassword'
import { Signup } from './components/common/Signup';
const App = () => {
  return (
    <div className='flex flex-col w-screen min-h-screen bg-richblue-900 text-white  justify-between' >
        <Navbar/>
        
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<PasswordReset/>}></Route>
      </Routes>
      
      <Footer/>
      
    </div>
  )
}
//36-907
export default App;