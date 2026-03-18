// ==================== evaluation.model.js ====================
import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
      required: [true, "Rating is required"],
    },
    comment: {
      type: String,
      minlength: [3, "Comment must be at least 3 characters"],
      maxlength: [500, "Comment must not exceed 500 characters"],
    },
    dateEvaluation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Evaluation",
  }
);

export const evaluationModel = mongoose.model("Evaluation", evaluationSchema);