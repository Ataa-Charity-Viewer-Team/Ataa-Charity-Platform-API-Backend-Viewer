// ==================== Import Mongoose Framework ======================
import mongoose from "mongoose";

// ==================== Donation Status ======================
export const donationStatus = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
};
export const donationSize=["XS","S", "M", "L", "XL", "XXL","3XL","4XL","5XL"];
// ==================== Donation Types ======================
export const donationTypes = ["رجالي", "حريمي", "أطفال"];
// ==================== Donation Schema ======================
const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },

    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },
    type: {
      type: String,
      enum: object.values(donationTypes),
      required: [true, "Type is required"],
    },
    size: {
      enum: object.values(donationSize),
      type: String,
      required: [true, "Size is required"],
        },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"],
      required: [true, "Quantity is required"],
    },
    description: {
      type: String,
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    imageUrl: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: Object.values(donationStatus),
      default: donationStatus.pending,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Donation",
  }
);

// ==================== Donation Model ======================
export const donationModel = mongoose.model("Donation", donationSchema);