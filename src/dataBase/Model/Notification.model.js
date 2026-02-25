// ==================== notification.model.js ====================
import mongoose from "mongoose";

export const notificationStatus = {
  unread: "unread",
  read: "read",
};

export const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Data",
      required: true,
    },
    DonationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(notificationStatus),
      default: notificationStatus.unread,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
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