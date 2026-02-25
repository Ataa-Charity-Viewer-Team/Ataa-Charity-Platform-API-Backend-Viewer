// ==================== report.model.js ====================
import mongoose from "mongoose";

// ==================== Report Schema ======================
const reportSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    type: {
      type: String,
      required: [true, "Report type is required"],
    },
  },
  {
    timestamps: true,
    collection: "Report_Admin",
  }
);

// ==================== Report Model ======================
export const reportModel = mongoose.model("Report_Admin", reportSchema);