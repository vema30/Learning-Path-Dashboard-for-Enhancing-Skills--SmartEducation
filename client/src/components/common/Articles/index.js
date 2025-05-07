
import React, { useState } from 'react';
import BlogForm from './BlogForm';
import BlogList from './BlogList';
import { useDispatch, useSelector } from "react-redux";

const Articles = () => {
  const [query, setQuery] = useState('');
  
  // Access the user data from Redux store
  const user = useSelector((state) => state.profile.user); // Accessing the 'user' object from 'profile'
  
  console.log("User object:", user);
  
  // Check if the user's accountType is 'Instructor'
  const isInstructor = user && user.accountType === 'Instructor';

  return (
    <div className="p-4 text-black">
      {isInstructor ? (
  <div>
    <h1 className="text-2xl font-bold mb-6 text-center bg-white p-4 rounded-xl shadow">
    Create Blog Posts as an Instructor
  </h1>
  <BlogForm/>
    </div>
) : (
  <>
    <h1 className="text-2xl font-bold mb-4 text-center bg-white p-4 rounded-xl shadow">
      Read Blogs for Fun 🎉
    </h1>
    <input
      type="text"
      placeholder="Search posts..."
      className="border p-2 mb-4 w-full rounded-xl shadow"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </>
)}
<BlogList/>

    </div>
  );
};

export default Articles;
