import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function CommentSection({ postId }) {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);

  // Get the user's name from the Redux store (assuming the user is stored as 'firstName' and 'lastName')
  const user = useSelector((state) => state.profile.user);
  const userName = user ? `${user.firstName} ${user.lastName}` : "Anonymous";  // Default to "Anonymous" if no user is logged in

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Add a new comment or reply to an existing one
  const addComment = async (parentId = null) => {
    if (!text.trim()) return; // Prevent adding empty comments

    try {
      await axios.post(
        `http://localhost:4000/api/posts/${postId}/comments`,
        {
          text,
          parentId,
          userName,  // Send the user's name along with the comment
        }
      );
      setText('');
      fetchComments(); // Reload comments after posting
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [postId]); // Ensure we fetch comments again if postId changes

  // Recursive rendering of comments, supports replies
  const renderComments = (parentId = null) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <div key={c._id} className="ml-4 border-l pl-2 mt-2">
          <div className="text-sm font-semibold text-gray-800">{c.userName || "Anonymous"}</div>
          <p className="text-gray-700">{c.text}</p>
          <button
            onClick={() => addComment(c._id)}  // Reply to this comment
            className="text-sm text-blue-600 hover:underline"
          >
            Reply
          </button>
          <div className="mt-2">{renderComments(c._id)}</div> {/* Recursive rendering of replies */}
        </div>
      ));

  return (
    <div className="mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
        className="border p-1 w-full"
      />
      <button onClick={() => addComment()} className="bg-gray-200 mt-1 px-2 py-1">
        Comment
      </button>
      <div className="mt-2">{renderComments()}</div> {/* Render the list of comments */}
    </div>
  );
}
