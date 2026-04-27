// ==================== Import Mongoose Framework ======================
import mongoose from "mongoose";

// ==================== User Roles ====================
export const roles = {
  user: "user",
  charity: "charity",
  admin: "admin",
};

// ==================== User Schema ====================
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must not exceed 30 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      immutable: true,
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
    passwordChangedAt: {
      type: Date,
    },
    licenseNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: function () {
        return this.roleType === roles.charity;
      },
    },
    nationalID: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      required: function () {
        return this.roleType === roles.admin;
      },
    },
  },
  {
    timestamps: true,
    collection: "User_Data",
  }
);

// ==================== User Model ====================
export const userModel = mongoose.model("User_Data", userSchema);