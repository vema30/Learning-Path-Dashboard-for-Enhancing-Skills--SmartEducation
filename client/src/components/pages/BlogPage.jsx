// BlogPage.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa"; // Trash and Edit Icons
import { toast } from "react-hot-toast";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const userRole = localStorage.getItem("role"); // Get the role from localStorage or a global state
console.log("userRole",userRole);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/v1/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog.");
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 bg-gray-50">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Latest Blog Posts</h2>

      {/* Create Blog Button (Only visible to admin/instructor) */}
      {(userRole === "Admin" || userRole === "Instructor") && (
        <div className="flex justify-end mb-6">
          <Link to="/create-blog">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105">
              Create Blog
            </button>
          </Link>
        </div>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-blue-700 p-6 rounded-lg shadow-lg relative transition transform hover:scale-105 hover:shadow-xl"
          >
            {/* Blog Image */}
            {blog.image && (
              <img
                src={blog.image} // Assuming the blog object has an image field with URL
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            {/* Edit & Delete Icons (Only visible to admin/instructor) */}
            {(userRole === "Admin" || userRole === "Instructor") && (
              <>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="absolute top-4 right-4 text-white hover:text-red-400 transition"
                  title="Delete Blog"
                >
                  <FaTrash size={20} />
                </button>

                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="absolute top-4 left-4 text-white hover:text-yellow-400 transition"
                  title="Edit Blog"
                >
                  <FaEdit size={20} />
                </Link>
              </>
            )}

            <h3 className="text-2xl font-semibold text-white mb-3">{blog.title}</h3>
            <p className="text-sm text-blue-200 mb-3">
              By {blog.author} | {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            <Link
              to={`/blogs/${blog._id}`}
              className="text-blue-200 hover:text-blue-400 transition-all mt-3 inline-block"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
