// ========================== Import Mongoose Framework ======================
import mongoose from "mongoose";
// ========================== OTP Code Types =====================
export const codeOTP = {
  activateAccount: "Activate Your Account",
  forgetPassword: "Reset Your Password",
  verifyEmail: "Verify Your Email",
};

// ========================== OTP Schema =====================
export const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Data",
    required: true
  },
  code: {
    type: String,
    required: true
  },
  codeType: {
    type: String,
    enum: Object.values(codeOTP),
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  }
}, {
  timestamps: true,
  collection: "OTP_Code"
});
// ========================== Expiration Index (TTL) =====================
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ========================== Unique Index (Fast Query Search) =====================
otpSchema.index({ userId: 1, code: 1 });
// ========================== OTP Model =====================
export const otpModel = mongoose.model("OTP_Code", otpSchema);