import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // State to handle error messages
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken"); // Or sessionStorage

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    console.log("file",file);
    // Show preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!title || !content) {
      setError("Title and Content are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // formData.append("Username",localStorage.getItem("user").firstname)
    const userStr = localStorage.getItem("user"); // Get the string from localStorage

if (userStr) {
  const user = JSON.parse(userStr); // Convert JSON string to object
  const formData = new FormData();
  formData.append("Username", user.firstName); // Correct key: "firstName" with capital 'N'
} else {
  console.error("User not found in localStorage.");
}

    if (media) {
      formData.append("media", media);
    } else {
      setError("No media selected. You can skip uploading media.");
    }
  
    try {
      setLoading(true);
      setError(null); // Reset error message
  
      const response = await fetch("https://learning-path-dashboard-for-enhancing-7n8z.onrender.com/api/v1/blogs", {
        method: "POST",      headers: {
            "Authorization": `Bearer ${authToken}`,
          },
    
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to create blog");
      }
  
      const result = await response.json();
      console.log("Blog Created:", result);
  
      navigate("/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      setError("Failed to create blog. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-6">
      <div className="bg-blue-100 p-8 rounded-lg shadow-md w-full text-blue-600 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create a New Blog
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter your blog title"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Blog Content
            </label>
            <textarea
              placeholder="Write your blog content here..."
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Upload Media */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image / Video (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              className="w-full"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Preview:</p>
              {media && media.type.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="w-full rounded-md" />
              ) : (
                <video src={previewUrl} controls className="w-full rounded-md" />
              )}
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-black font-semibold py-3 px-8 rounded-md transition duration-300"
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
