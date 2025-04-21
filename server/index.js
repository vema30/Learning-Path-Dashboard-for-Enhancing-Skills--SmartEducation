const express = require("express");
const app = express();
const path = require('path');





 const userRoutes = require("./routes/User");

const profileRoutes = require("./routes/Profile");

const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const dataBaseConnection = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
dataBaseConnection();
//middlewares
app.use(express.json());
app.use(cookieParser());
 app.use(cors());

 //middleware for cors
app.use(
	cors({
	  origin: "http://localhost:3000",
	  credentials: true,
	  methods: ["GET", "POST", "PUT", "DELETE"],
	  allowedHeaders: ["Content-Type", "Authorization"],
	})
  );
  

//middleware for fileuplading
app.use(fileUpload());
// app.use(
// 	fileUpload({
// 		useTempFiles:true,
// 		tempFileDir:"/tmp",
// 		limits: { fileSize: 550 * 1024 * 1024 },
// 	})
// )
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));

//cloudinary connection
cloudinaryConnect();

//routes

 app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
 app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach",contactUsRoute);
app.use("/api/v1/payment", paymentRoutes);
//app.use("/api/v1/reach", contactUsRoute);

//def route

app.get("/", (req, res) => {
	console.log("hey");
	return res.json({
		success:true,
		message:`Your server is up and running....${PORT}`
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`);
})
