// ==================== Import Mongoose Framework ======================
import mongoose from "mongoose";

// ==================== User Roles ====================
export const roles = {
  user: "user",
  charity: "charity",
  admin: "admin"};

// ==================== User Schema ====================
const userSchema = new mongoose.Schema(
  {
        userName: {
      type: String,
      match: [
        /^[a-zA-Z\u0621-\u064A][^#&<>"~;$^%{}]{2,29}$/,
        "Username must contain only letters and valid characters"
      ],
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must not exceed 30 characters"],
      trim: true,
    },

    email: {
      type: String,
      match: [
     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|edu)$/,        "Invalid email format",
      ],
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [100, "Address must not exceed 100 characters"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },

    verify: {
      type: Boolean,
      default: false,
    },

    roleType: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
  },
  {
    timestamps: true,
    collection: "User_Data",
  }
);

// ==================== User Model ====================
export const userModel = mongoose.model("User_Data", userSchema);
