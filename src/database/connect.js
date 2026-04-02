import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI.replace("MONGO_URI=", ""));
  } catch (error) {
    console.error("Failed to connect DB ❌", error.message);
    throw error;
  }
};

export default connectDB;