const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error in MongoDB connection:", error);
    process.exit(1);
  }
};
mongoose.set('strictPopulate', false);


module.exports = dataBaseConnection;
