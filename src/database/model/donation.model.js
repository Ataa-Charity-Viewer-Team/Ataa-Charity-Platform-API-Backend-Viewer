// ==================== Import Mongoose Framework ======================
import mongoose from "mongoose";

// ==================== Donation Status ======================
export const donationStatus = [
  { en: "pending", ar: "قيد الانتظار" },
  { en: "accepted", ar: "مقبول" },
  { en: "rejected", ar: "مرفوض" },
];
export const donationSize=["XS","S", "M", "L", "XL", "XXL","3XL","4XL","5XL"];
// ==================== Donation Types ======================
export const donationTypes = [
  { ar: "رجالي", en: "Men" },
  { ar: "حريمي", en: "Women" },
  { ar: "أطفال", en: "Kids" },
];
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
      required: [true, "Type is required"]
    },

    size: {
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
      default: "pending",
      required: true,
    },

    dateDonation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Donation",
  }
);
// ==================== Donation Model ======================
export const donationModel = mongoose.model("Donation", donationSchema);