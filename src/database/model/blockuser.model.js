import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema({
  email: String,
  phone: String,
  username: String,
  deviceFingerprint: String,
  ipAddress: String,
  blockedAt: { type: Date, default: Date.now }
});

export default mongoose.model("BlockedUser", blockedUserSchema);