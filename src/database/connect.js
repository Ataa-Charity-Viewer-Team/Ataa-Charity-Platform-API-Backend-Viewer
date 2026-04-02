import mongoose from 'mongoose';

const connectDB = async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully ✅");
  } catch (error) {
    console.error("Failed to connect DB ❌", error.message);
    throw error;
  }
};

export default connectDB;