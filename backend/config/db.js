import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to database");
  } catch (error) {
    console.log("An error occured while connecting to database");
  }
};

export default connectDB;