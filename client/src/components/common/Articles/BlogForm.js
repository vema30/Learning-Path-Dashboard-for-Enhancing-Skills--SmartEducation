import React, { useState } from 'react';
import axios from 'axios';

export default function BlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));  // Generate temporary preview URL
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);
    try {
      await axios.post('http://localhost:4000/api/posts', formData);
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      alert('Post created successfully!');
    } catch (e) {
      console.log('Error in BlogForm:', e.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200 space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create a New Blog Post</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 border border-gray-300  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows="6"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none  focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full text-sm text-gray-600"
      />

      {imagePreview && (
        <div className="mt-4">
          <p className="text-gray-700 mb-2">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-w-sm rounded-xl shadow"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200"
      >
        Post
      </button>
    </form>
  );
}
