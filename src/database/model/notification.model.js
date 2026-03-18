import mongoose from "mongoose";

export const notificationStatus = [
  { en: "unread", ar: "غير مقروء" },
  { en: "read", ar: "مقروء" },
];

export const notificationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: notificationStatus.map(s => s.en), // إنجليزي فقط
      default: "unread",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    dateNotification: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "Notification",
  }
);

export const notificationModel = mongoose.model(
  "Notification",
  notificationSchema
);