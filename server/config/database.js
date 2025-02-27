const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error in MongoDB connection:", error);
    process.exit(1);
  }
};

module.exports = dataBaseConnection;
