// ==================== report.model.js ====================
import mongoose from "mongoose";

// ==================== Report Schema ======================
const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },
    description: {
      type: String,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must not exceed 500 characters"],
      required: [true, "Description is required"]
    },
    dateReport: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Report_Admin",
  }
);

// ==================== Report Model ======================
export const reportModel = mongoose.model("Report_Admin", reportSchema);




