import React from 'react'
import { Route, Routes } from "react-router"
import {HomePage} from './components/pages/HomePage';
import { Navbar } from './components/common/Navbar';
const App = () => {
  return (
    <div >
            <Navbar />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
      </Routes>
      
    </div>
  )
}
//36-907
export default App;