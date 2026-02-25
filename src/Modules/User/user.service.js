import { userModel } from "../../database/model/user.model.js";
import { decryptPhone, encryptPhone } from "../../utils/encryption/encryption.js";
import bcrypt from "bcrypt";
import { hashPassword } from '../../utils/hashing(password)/hashing.js';
// =================1) My Profile =================
export const getMyProfile = async (req, res, next) => {
  const { user } = req
  const finder = await userModel.findById(user._id).select("-password -__v");
  if (!finder) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.phone) {
    finder.phone = decryptPhone({ cipherText: user.phone });
  }
  return res.status(200).json({ success: true, finder });
};
// ======================2) Update My Profile ======================
export const updateMyProfile = async (req, res, next) => {
  const { userName, phone, address } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (req.body.phone) {
    req.body.phone = encryptPhone({ cipherText: req.body.phone });
  }
  await userModel.findByIdAndUpdate(req.user._id, { ...req.body });
  return res.status(200).json({ success: true, message: "Profile updated successfully" });
};

// ======================3) Change Password ======================
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }
  user.password = await hashPassword({ plainText: newPassword });
  await user.save();
  return res.status(200).json({ success: true, message: "Password changed successfully" });
};
// ======================4) Delete My Account ======================
export const deleteMyAccount = async (req, res, next) => {
  await userModel.findByIdAndDelete(req.user._id);
  return res.status(200).json({ success: true, message: "Account deleted successfully" });
};
// ====================== 5) Get All Users ======================
export const getAllUsers = async (req, res, next) => {
  const data = await advancedPagination(userModel);
  res.status(200).json({ success: true, data });
};// ====================== 6) Get User By Id ======================
export const getUserById = async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select("-password  -__v");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, user });
};
// ====================== 7) Delete User By Id ======================
export const deleteUser = async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, message: "User deleted successfully" });
};