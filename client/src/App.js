import React from 'react'
import { Route, Routes } from "react-router"
import HomePage from './components/pages/HomePage';
import { Navbar } from './components/common/Navbar';
import Footer from './components/common/Footer';
const App = () => {
  return (
    <div className='flex flex-col w-screen min-h-screen bg-richblue-900 text-white' >
        
      <Routes>
        <Route path='/' element={<HomePage/>}/>
      </Routes>
      <Footer/>
      
    </div>
  )
}
//36-907
export default App;