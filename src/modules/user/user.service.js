import { userModel } from "../../database/model/user.model.js";
import { decryptPhone, encryptPhone } from "../../utils/encryption/encryption.js";
import { advancedPagination } from '../../middleware/pagination.middleware.js'; 
import { hashPassword , comparePassword } from '../../utils/hashing/hashing.js';

export const getMyProfile = async (req, res, next) => {
  const { user } = req;
  const finder = await userModel.findById(user._id).select("-password -__v");
  if (!finder) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (finder.phone) {
    finder.phone = decryptPhone({ cipherText: finder.phone });
  }
  return res.status(200).json({ success: true, finder });
};

export const updateMyProfile = async (req, res, next) => {
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

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }
 user.password = hashPassword({ plainText: newPassword });
  user.passwordChangedAt = Date.now();
  await user.save(); 
 return res.status(200).json({ success: true, message: "Password changed successfully" });
};

export const deleteMyAccount = async (req, res, next) => {
  await userModel.findByIdAndDelete(req.user._id);
  return res.status(200).json({ success: true, message: "Account deleted successfully" });
};

export const getAllUsers = async (req, res, next) => {
  const data = await advancedPagination(userModel, {}, req); 
  return res.status(200).json({ success: true, data });
};

export const getUserById = async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select("-password -__v");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, user });
};

export const deleteUser = async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ success: true, message: "User deleted successfully" });
};