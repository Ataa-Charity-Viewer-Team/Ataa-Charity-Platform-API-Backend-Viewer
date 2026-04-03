import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  const connect = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("MongoDB Connected ✅");
    } catch (error) {
      console.error("DB connection failed ❌, retrying in 5s...");
      setTimeout(connect, 5000); // retry
    }
  };

  await connect();
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected ⚠️... reconnecting");
    connect();
  });

  mongoose.connection.on("error", (err) => {
    console.log("MongoDB error ❌", err.message);
  });
};

export default connectDB;