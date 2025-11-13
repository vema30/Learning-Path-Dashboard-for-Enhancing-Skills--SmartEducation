import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setError('');
    setSuccess('');

    if (!categoryName) {
      setError('Category name is required');
      return;
    }

    try {
      // Sending POST request to the backend API
      const response = await axios.post('http://localhost:4000/api/categories', { name: categoryName });

      // On success, display the success message and reset the input
      setSuccess('Category created successfully');
      setCategoryName('');
      // You can redirect to another page (e.g., the categories list page)
      setTimeout(() => {
        navigate('/dashboard');  // Change the redirect path as needed
      }, 2000);
    } catch (err) {
      setError('Error creating category, please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-md shadow-lg text-black">
      <h2 className="text-2xl font-semibold mb-4">Create Category</h2>

      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="categoryName"
            className="w-full p-2 mt-2 border rounded-md"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
