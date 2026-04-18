import mongoose from "mongoose";

export const senderTypes = {
  user: "user",
  charity: "charity",
};

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },

    senderType: {
      type: String,
      enum: Object.values(senderTypes),
      required: true,
    },

    description: {
      type: String,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must not exceed 500 characters"],
      required: [true, "Description is required"],
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

export const ReportModel = mongoose.model("Report_Admin", reportSchema);