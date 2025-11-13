import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      console.log("Blog ID:", id); // Log the id to verify it's being passed correctly
      try {
        const res = await axios.get(`https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/v1/blogs/${id}`); // Ensure the URL matches the backend route
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="text-center text-xl font-semibold">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-700 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
      <p className="text-gray-600 text-lg mb-6">
        By <span className="font-semibold">{blog.author}</span> |{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      
      {/* Conditionally render the media file */}
      {blog.mediaUrl && (
        <div className="my-6">
          <img
            src={`http://localhost:4000${blog.mediaUrl}`} // Full path to the image
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="text-lg text-gray-700 space-y-4">
        <p>{blog.content}</p>
      </div>

      <div className="mt-8">
        <Link
          to="/blog"
          className="inline-block px-6 py-3 bg-blue-300 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
        >
          Back to Blog List
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;
