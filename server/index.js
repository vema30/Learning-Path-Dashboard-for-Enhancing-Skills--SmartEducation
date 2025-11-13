const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/User");
const blogRoutes = require("./routes/blogRoutes.js");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const dataBaseConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const testRoutes = require("./routes/testRoutes");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connection
dataBaseConnection();

// Middleware configurations
app.use(express.json());
app.use(cookieParser());

// CORS configuration for local development and production
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000", // Default to localhost during development
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://learning-path-dashboard-for-enhanci.vercel.app"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(cors({
  origin: "*", // allows all domains
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));



// Middleware for file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file upload limit to 5 MB
  })
);

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cloudinary setup for image uploads
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/blogs", blogRoutes);
//app.use("/api/v1/tests", testRoutes);

const cloudinary = require("cloudinary").v2;
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/quizzes', require('./routes/quizRoutes'))
app.use('/api/tests', require('./routes/testRoutes'))
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blogs", // Define folder in Cloudinary
    });
    return result.secure_url; // Cloudinary URL for the uploaded image
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
    throw new Error("Cloudinary upload failed");
  }
};

// Default route to check server status
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: `Your server is up and running on port ${PORT}`,
  });
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
