import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';

export const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/course/categories');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-11/12 max-w-maxContent mx-auto py-4">
      <div className="flex items-center">
        
        {/* Logo / Branding */}
        <Link to="/" className="text-2xl font-bold text-yellow-500 tracking-wide">
          StudySphere
        </Link>

        {/* Centered Navbar Links */}
        <div className="flex-1 flex justify-center gap-6 text-lg font-semibold">
          {NavbarLinks.map((nav, index) => (
            nav.title === "Catalog" ? (
              <div 
                key={index} 
                className="relative"
                onMouseEnter={() => setIsCatalogOpen(true)}
                onMouseLeave={() => setIsCatalogOpen(false)}
              >
                <button className="text-richblack-200 hover:text-white transition-all duration-200">
                  Catalog ▼
                </button>
                {isCatalogOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-richblack-900 shadow-lg rounded-md z-10">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link 
                          key={category._id} 
                          to={`/catalog/${category._id}`} 
                          className="block px-4 py-2 text-richblack-200 hover:bg-richblack-800 transition-all duration-200"
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-richblack-400">Loading...</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                key={index} 
                to={nav.path || "#"} 
                className="text-richblack-200 hover:text-white transition-all duration-200"
              >
                {nav.title}
              </Link>
            )
          ))}
        </div>

        {/* Login & Signup Buttons (Kept at Right) */}
        <div className="flex gap-4 ml-auto">
          <Link 
            to="/login" 
            className="px-4 py-2 border border-richblack-200 text-richblack-200 rounded-md hover:bg-richblack-800 transition-all duration-200"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-all duration-200"
          >
            Signup
          </Link>
        </div>
        
      </div>
    </div>
  );
};
