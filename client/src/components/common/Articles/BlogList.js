import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogItem from './BlogItem';

const BlogList = ({ searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);  // For loading state
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true when starting to fetch
      try {
        const url = searchQuery
          ? `http://localhost:4000/search?query=${encodeURIComponent(searchQuery)}`
          : `http://localhost:4000/api/posts`;

        const res = await axios.get(url);
        
        if (res.data && Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setError(error.message);  // Set error state if there's an error
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchPosts();
  }, [searchQuery]);

  const handleDelete = (postId) => {
    // Remove the post from the state by filtering it out
    setPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
  };

  if (loading) return <div>Loading...</div>;  // Loading state
  if (error) return <div>Error: {error}</div>;  // Error state

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 mt-6">
      {posts.length > 0 ? (
        posts.map(post => (
          <BlogItem key={post._id} post={post} onDelete={handleDelete} />
        ))
      ) : (
        <div className="text-center text-gray-500 col-span-full mt-8 text-lg">No posts found</div>
      )}
    </div>
  );
};

export default BlogList;
