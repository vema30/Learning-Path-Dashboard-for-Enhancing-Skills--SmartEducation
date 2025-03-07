import React from 'react';
import { NavbarLinks } from '../../data/navbar-links';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  //In React, useLocation is a hook provided by React Router that allows you to access the current URL's location object. It is useful when you need to track changes in the URL or extract query parameters.


  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Navbar Links */}
      <div className="flex space-x-6">
        {NavbarLinks.map((navItem, idx) => (
          <Link 
            key={idx} 
            to={navItem.path} 
            className="text-lg text-black font-medium hover:text-gray-400 transition duration-300"
          >
            {navItem.title}
          </Link>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
        <Link to="/signup" className="px-4 py-2 bg-gray-700 text-white bg-blue-600 hover:bg-blue-500 rounded-lg hover:bg-gray-600 transition duration-300">
          Login
        </Link>
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300">
          Signup
        </Link>
      </div>
    </div>
  );
};
