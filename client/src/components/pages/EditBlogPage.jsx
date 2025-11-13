import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [image, setImage] = useState(null); // State to handle image upload

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/blogs/${id}`);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          author: res.data.author,
        });
        setImage(res.data.mediaUrl); // Load the current image URL (if any)
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the image file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("author", formData.author);
    dataToSend.append("content", formData.content);

    // Append the new image if selected
    if (image && typeof image !== "string") {
      dataToSend.append("image", image);
    }

    try {
      await axios.put(`https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/v1/blogs/${id}`, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      toast.success("Blog updated successfully!");
      navigate("/blogs"); // after editing, go back to BlogPage
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-blue-700 shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Author Input */}
        <div>
          <label htmlFor="author" className="block text-lg font-medium text-gray-700">
            Author Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author's name"
            className="w-full text-black p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium text-gray-700">
            Blog Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here"
            className="w-full text-black p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {image && typeof image !== "string" && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          {image && typeof image === "string" && (
            <div className="mt-4">
              <img
                src={`http://localhost:4000${image}`}
                alt="Current Image"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
