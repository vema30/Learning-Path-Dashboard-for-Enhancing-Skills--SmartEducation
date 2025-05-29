const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
   // await mongoose.connection.collection("users").dropIndex("completedLectures_1");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error in MongoDB connection:", err);
  }
};

mongoose.set("strictPopulate", false);
module.exports = dataBaseConnection;
