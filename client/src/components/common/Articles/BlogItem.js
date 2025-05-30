import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentSection from './CommentSection';
import { useDispatch, useSelector } from "react-redux";

export default function BlogItem({ post, onDelete }) {
  const [likes, setLikes] = useState(post.likes || []);  // Ensure likes is an array
  const [currentUser, setCurrentUser] = useState(null);
  const user = useSelector((state) => state.profile.user);
  const isInstructor = user && user.accountType === 'Instructor';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Replace with actual decode if needed
        // const decoded = jwtDecode(token);
        const decoded = { id: 'INSTRUCTOR_ID', role: 'Instructor' }; // Simulate decoded user
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleLike = async (postId) => {
    try {
        const timestamp = Date.now().toString();  // Create a timestamp as a string
        
        // Avoid duplicates by checking if the like already exists
        if (likes.includes(timestamp)) {
            alert('You already liked this post');
            return;
        }

        const response = await axios.post(
            `http://localhost:4000/api/posts/${postId}/like`,
            { likeId: timestamp }  // Send the timestamp in the request body
        );

        // Add the new like to the likes array
        setLikes((prevLikes) => [...prevLikes, timestamp]);

    } catch (error) {
        console.error('Error liking post:', error.response?.data || error.message);
    }
};

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Post deleted successfully');
      if (onDelete) onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
    }
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href + '#post-' + post._id);
    alert('Link copied!');
  };

 console.log("hh",post);
  return (
    <div id={`post-${post._id}`} 
    className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-6 transition hover:shadow-xl duration-300 ">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 ">{post.title}</h2>
      <p className="text-gray-700 text-base line-clamp-3  mb-4">{post.content}</p>
       
      {post.image && (
        <img
        src={
          post.image.startsWith('http')
            ? post.image  // external hosted image like Cloudinary
            : `http://localhost:4000/uploads/${post.image}` // local file fallback
        }
                alt=""
                className="w-full h-48 object-cover rounded-xl mb-4"
                />
      )}

<div className="flex items-center justify-between text-sm text-gray-500">
<button
          onClick={() => handleLike(post._id)}
          className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium"

        >
          ❤️ <span className="ml-1">{likes.length}</span>  {/* Show number of likes */}
        </button>

        <button
          onClick={share}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          🔗 Share
        </button>

        {isInstructor &&  (
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto"
            >
            🗑️ Delete
          </button>
        )}
      </div>

      <CommentSection postId={post._id} />
    </div>
  );
}
