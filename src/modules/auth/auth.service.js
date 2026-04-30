// // ========================== # Auth Service and send email vercel # =======================
// import { roles, userModel } from "../../database/model/user.model.js";
// import { charityModel } from "../../database/model/charity.model.js";
// import { encryptPhone } from "../../utils/encryption/encryption.js";
// import { hashPassword, comparePassword } from "../../utils/hashing/hashing.js";
// import { createToken, verifyToken } from "../../utils/token/token.js";
// import { customAlphabet } from "nanoid";
// import { sendEmails } from '../../utils/sendemails/sendemail.nodemailer.js';
// import { templet } from '../../utils/sendemails/generate.html.js';
// import { codeOTP, otpModel } from "../../database/model/otp.model.js";
// import { waitUntil } from '@vercel/functions';

// // ===========================1) Register Account  ===========================
// autexport const registerAccount = async (req, res, next) => {
//   const { userName, email, phone, password, address, roleType } = req.body;
  
//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) return next(new Error("Email already exists", { cause: 409 }));

//   if (req.body.nationalID) {
//     req.body.nationalID = encryptPhone({ plainText: req.body.nationalID });
//   }

//   const passwordHash = hashPassword({ plainText: password });
//   const encryptedPhone = encryptPhone({ cipherText: phone });
  
//   const newUser = await userModel.create({ 
//     ...req.body, 
//     phone: encryptedPhone, 
//     password: passwordHash 
//   });

//   const userData = await userModel.findById(newUser._id).select("-password -__v -phone -nationalID");
//   const sendCode = customAlphabet("0123456789", 6)();
  
//   await otpModel.deleteMany({ userId: newUser._id, codeType: codeOTP.activateAccount });
//   await otpModel.create({ userId: newUser._id, code: sendCode, codeType: codeOTP.activateAccount });
  
//   waitUntil(sendEmails({ to: email, subject: codeOTP.activateAccount, html: templet({ sendCode }) }));
  
//   return res.status(201).json({ 
//     success: true, 
//     user: userData, 
//     message: "User registered successfully. Please check your email for OTP." 
//   });
// };
// // ===========================2) Login  ===========================
// export const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("Invalid email or password", { cause: 404 }));

//   const isValid = comparePassword({ plainText: password, hashPassword: user.password });
//   if (!isValid) {
//     return next(new Error("Invalid email or password", { cause: 401 }));
//   }

//   if (!user.verify) {
//     return next(new Error("Please verify your email first", { cause: 403 }));
//   }

//   const accessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN }
//   });

//   const refreshToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.REFRESH_SECRET,
//     options: { expiresIn: process.env.REFRESH_TOKEN }
//   });

//   return res.status(200).json({
//     success: true,
//     message: "User logged in successfully",
//     tokens: { accessToken, refreshToken }
//   });
// };

// // ===========================3) Verify Email ===========================
// export const verifyEmail = async (req, res, next) => {
//   const { email, code } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("User not found", { cause: 404 }));

//   if (user.verify) {
//     return next(new Error("Email already verified", { cause: 409 }));
//   }

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.activateAccount });
//   if (!otpRecord) {
//     return next(new Error("Invalid or Expired OTP", { cause: 400 }));
//   }

//   user.verify = true;
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({
//     success: true,
//     message: "Email verified successfully. You can login now."
//   });
// };

// // ====================4) Forget Password  =======================
// export const forgetPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const sendForget = customAlphabet("0123456789", 6)();
//   await otpModel.deleteMany({ userId: user._id, codeType: codeOTP.forgetPassword });
//   await otpModel.create({ userId: user._id, code: sendForget, codeType: codeOTP.forgetPassword });

//   waitUntil(sendEmails({ to: email, subject: codeOTP.forgetPassword, html: templet({ sendCode: sendForget }) }));

//   return res.status(200).json({
//     success: true,
//     message: "Password reset OTP sent to your email."
//   });
// };

// // ===========================5) Reset Password ===========================
// export const resetPassword = async (req, res, next) => {
//   const { email, code, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.forgetPassword });
//   if (!otpRecord) {
//     return next(new Error("Invalid or Expired OTP", { cause: 400 }));
//   }

//   user.password = hashPassword({ plainText: password });
//   user.passwordChangedAt = new Date();
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({ success: true, message: "Password has been reset successfully." });
// };

// // ===========================6) Refresh Token ===========================
// export const refreshToken = async (req, res, next) => {
//   const { refreshToken } = req.body;

//   const decoded = verifyToken({ token: refreshToken, secret: process.env.REFRESH_SECRET });
//   if (!decoded?.id) {
//     return next(new Error("Invalid Token", { cause: 400 }));
//   }

//   const user = await userModel.findById(decoded.id);
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const newAccessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN }
//   });

//   return res.status(200).json({ success: true, accessToken: newAccessToken });
// };

// // ========================== # Auth Service and send email vercel # =======================
// import { roles, userModel } from "../../database/model/user.model.js";
// import { charityModel } from "../../database/model/charity.model.js";
// import { encryptPhone } from "../../utils/encryption/encryption.js";
// import { hashPassword, comparePassword } from "../../utils/hashing/hashing.js";
// import { createToken, verifyToken } from "../../utils/token/token.js";
// import { customAlphabet } from "nanoid";
// import { sendEmails } from '../../utils/sendemails/sendemail.nodemailer.js';
// import { templet } from '../../utils/sendemails/generate.html.js';
// import { codeOTP, otpModel } from "../../database/model/otp.model.js";
// import { waitUntil } from '@vercel/functions';

// // ===========================1) Register Account  ===========================
// export const registerAccount = async (req, res, next) => {
//   const { userName, email, phone, password, address, roleType } = req.body;
  
//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) return next(new Error("Email already exists", { cause: 409 }));

//   if (req.body.nationalID) {
//     req.body.nationalID = encryptPhone({ plainText: req.body.nationalID });
//   }

//   const passwordHash = hashPassword({ plainText: password });
//   const encryptedPhone = encryptPhone({ cipherText: phone });
  
//   const newUser = await userModel.create({ 
//     ...req.body, 
//     phone: encryptedPhone, 
//     password: passwordHash 
//   });

//   const userData = await userModel.findById(newUser._id).select("-password -__v -phone -nationalID");
//   const sendCode = customAlphabet("0123456789", 6)();
  
//   await otpModel.deleteMany({ userId: newUser._id, codeType: codeOTP.activateAccount });
//   await otpModel.create({ userId: newUser._id, code: sendCode, codeType: codeOTP.activateAccount });
  
//   waitUntil(sendEmails({ to: email, subject: codeOTP.activateAccount, html: templet({ sendCode }) }));
  
//   return res.status(201).json({ 
//     success: true, 
//     user: userData, 
//     message: "User registered successfully. Please check your email for OTP." 
//   });
// };
// // ===========================2) Login  ===========================
// export const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("Invalid email or password", { cause: 404 }));

//   const isValid = comparePassword({ plainText: password, hashPassword: user.password });
//   if (!isValid) {
//     return next(new Error("Invalid email or password", { cause: 401 }));
//   }

//   if (!user.verify) {
//     return next(new Error("Please verify your email first", { cause: 403 }));
//   }

//   const accessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN }
//   });

//   const refreshToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.REFRESH_SECRET,
//     options: { expiresIn: process.env.REFRESH_TOKEN }
//   });

//   return res.status(200).json({
//     success: true,
//     message: "User logged in successfully",
//     tokens: { accessToken, refreshToken }
//   });
// };

// // ===========================3) Verify Email ===========================
// export const verifyEmail = async (req, res, next) => {
//   const { email, code } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("User not found", { cause: 404 }));

//   if (user.verify) {
//     return next(new Error("Email already verified", { cause: 409 }));
//   }

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.activateAccount });
//   if (!otpRecord) {
//     return next(new Error("Invalid or Expired OTP", { cause: 400 }));
//   }

//   user.verify = true;
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({
//     success: true,
//     message: "Email verified successfully. You can login now."
//   });
// };

// // ====================4) Forget Password  =======================
// export const forgetPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const sendForget = customAlphabet("0123456789", 6)();
//   await otpModel.deleteMany({ userId: user._id, codeType: codeOTP.forgetPassword });
//   await otpModel.create({ userId: user._id, code: sendForget, codeType: codeOTP.forgetPassword });

//   waitUntil(sendEmails({ to: email, subject: codeOTP.forgetPassword, html: templet({ sendCode: sendForget }) }));

//   return res.status(200).json({
//     success: true,
//     message: "Password reset OTP sent to your email."
//   });
// };

// // ===========================5) Reset Password ===========================
// export const resetPassword = async (req, res, next) => {
//   const { email, code, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.forgetPassword });
//   if (!otpRecord) {
//     return next(new Error("Invalid or Expired OTP", { cause: 400 }));
//   }

//   user.password = hashPassword({ plainText: password });
//   user.passwordChangedAt = new Date();
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({ success: true, message: "Password has been reset successfully." });
// };

// // ===========================6) Refresh Token ===========================
// export const refreshToken = async (req, res, next) => {
//   const { refreshToken } = req.body;

//   const decoded = verifyToken({ token: refreshToken, secret: process.env.REFRESH_SECRET });
//   if (!decoded?.id) {
//     return next(new Error("Invalid Token", { cause: 400 }));
//   }

//   const user = await userModel.findById(decoded.id);
//   if (!user) {
//     return next(new Error("User not found", { cause: 404 }));
//   }

//   const newAccessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN }
//   });

//   return res.status(200).json({ success: true, accessToken: newAccessToken });
// };

// import { roles, userModel } from "../../database/model/user.model.js";
// import { charityModel, charityApprovalStatus } from "../../database/model/charity.model.js";
// import { encryptPhone } from "../../utils/encryption/encryption.js";
// import { hashPassword, comparePassword } from "../../utils/hashing/hashing.js";
// import { createToken, verifyToken } from "../../utils/token/token.js";
// import { customAlphabet } from "nanoid";
// import { sendEmails } from '../../utils/sendemails/sendemail.nodemailer.js';
// import { templet } from '../../utils/sendemails/generate.html.js';
// import { codeOTP, otpModel } from "../../database/model/otp.model.js";
// import { waitUntil } from '@vercel/functions';


// // ===========================1) Register Account===========================
// export const registerAccount = async (req, res, next) => {
//   const { userName, email, phone, password, address, roleType } = req.body;

//   // ← الأدمن مش بيسجل من هنا خالص
//   if (roleType === roles.admin) {
//     return next(new Error("Admin registration is not allowed", { cause: 403 }));
//   }

//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) return next(new Error("Email already exists", { cause: 409 }));

//   if (req.body.nationalID) {
//     req.body.nationalID = encryptPhone({ plainText: req.body.nationalID });
//   }

//   // ===== Charity: تحقق من البيانات الإضافية =====
//   if (roleType === roles.charity) {
//     const { licenseNumber, charityName } = req.body;
//     if (!licenseNumber) return next(new Error("License number is required", { cause: 400 }));
//     if (!charityName)   return next(new Error("Charity name is required",   { cause: 400 }));

//     const licenseExists = await charityModel.findOne({ licenseNumber });
//     if (licenseExists) return next(new Error("License number already registered", { cause: 409 }));
//   }

//   const passwordHash   = hashPassword({ plainText: password });
//   const encryptedPhone = encryptPhone({ cipherText: phone });

//   const newUser = await userModel.create({
//     ...req.body,
//     phone:    encryptedPhone,
//     password: passwordHash,
//   });

//   // ===== Charity: إنشاء سجل الجمعية بـ approvalStatus: pending =====
//   if (roleType === roles.charity) {
//     const { licenseNumber, charityName, charityDescription } = req.body;
//     const charityPhone = encryptPhone({ cipherText: phone });

//     const charity = await charityModel.create({
//       userId:         newUser._id,
//       charityName,
//       licenseNumber,
//       phone:          charityPhone,
//       address,
//       description:    charityDescription || "No description provided",
//       approvalStatus: charityApprovalStatus.pending,  // ← ينتظر موافقة الأدمن
//     });

//     if (!charity) {
//       await userModel.findByIdAndDelete(newUser._id); // rollback
//       return next(new Error("Failed to create charity profile", { cause: 500 }));
//     }
//   }

//   // ===== OTP =====
//   const sendCode = customAlphabet("0123456789", 6)();
//   await otpModel.deleteMany({ userId: newUser._id, codeType: codeOTP.activateAccount });
//   await otpModel.create({ userId: newUser._id, code: sendCode, codeType: codeOTP.activateAccount });
//   waitUntil(sendEmails({ to: email, subject: codeOTP.activateAccount, html: templet({ sendCode }) }));

//   const userData = await userModel.findById(newUser._id).select("-password -__v -phone -nationalID");
//   return res.status(201).json({
//     success: true,
//     user:    userData,
//     message: roleType === roles.charity
//       ? "Charity registered successfully. Waiting for admin approval."
//       : "User registered successfully. Please check your email for OTP.",
//   });
// };

// // ===========================2) Login===========================
// export const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("Invalid email or password", { cause: 404 }));

//   const isValid = comparePassword({ plainText: password, hashPassword: user.password });
//   if (!isValid) return next(new Error("Invalid email or password", { cause: 401 }));

//   if (!user.verify) return next(new Error("Please verify your email first", { cause: 403 }));

//   // ===== Charity: لازم الأدمن يوافق الأول =====
//   if (user.roleType === roles.charity) {
//     const charity = await charityModel.findOne({ userId: user._id });
//     if (!charity) return next(new Error("Charity profile not found", { cause: 404 }));

//     if (charity.approvalStatus === charityApprovalStatus.pending) {
//       return next(new Error("Your account is pending admin approval", { cause: 403 }));
//     }
//     if (charity.approvalStatus === charityApprovalStatus.rejected) {
//       return next(new Error(`Your account was rejected. Reason: ${charity.rejectionReason || "No reason provided"}`, { cause: 403 }));
//     }
//   }

//   const accessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret:  process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN },
//   });

//   const refreshToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret:  process.env.REFRESH_SECRET,
//     options: { expiresIn: process.env.REFRESH_TOKEN },
//   });

//   return res.status(200).json({ success: true, message: "Logged in successfully", tokens: { accessToken, refreshToken } });
// };

// // ===========================3) Verify Email===========================
// export const verifyEmail = async (req, res, next) => {
//   const { email, code } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("User not found", { cause: 404 }));
//   if (user.verify) return next(new Error("Email already verified", { cause: 409 }));

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.activateAccount });
//   if (!otpRecord) return next(new Error("Invalid or Expired OTP", { cause: 400 }));

//   user.verify = true;
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({ success: true, message: "Email verified successfully. You can login now." });
// };

// // ===========================4) Forget Password===========================
// export const forgetPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("User not found", { cause: 404 }));

//   const sendForget = customAlphabet("0123456789", 6)();
//   await otpModel.deleteMany({ userId: user._id, codeType: codeOTP.forgetPassword });
//   await otpModel.create({ userId: user._id, code: sendForget, codeType: codeOTP.forgetPassword });
//   waitUntil(sendEmails({ to: email, subject: codeOTP.forgetPassword, html: templet({ sendCode: sendForget }) }));

//   return res.status(200).json({ success: true, message: "Password reset OTP sent to your email." });
// };

// // ===========================5) Reset Password===========================
// export const resetPassword = async (req, res, next) => {
//   const { email, code, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return next(new Error("User not found", { cause: 404 }));

//   const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.forgetPassword });
//   if (!otpRecord) return next(new Error("Invalid or Expired OTP", { cause: 400 }));

//   user.password = hashPassword({ plainText: password });
//   await user.save();
//   await otpModel.deleteOne({ _id: otpRecord._id });

//   return res.status(200).json({ success: true, message: "Password has been reset successfully." });
// };

// // ===========================6) Refresh Token===========================
// export const refreshToken = async (req, res, next) => {
//   const { refreshToken } = req.body;

//   const decoded = verifyToken({ token: refreshToken, secret: process.env.REFRESH_SECRET });
//   if (!decoded?.id) return next(new Error("Invalid Token", { cause: 400 }));

//   const user = await userModel.findById(decoded.id);
//   if (!user) return next(new Error("User not found", { cause: 404 }));

//   const newAccessToken = createToken({
//     payload: { id: user._id, roleType: user.roleType },
//     secret:  process.env.ACCESS_SECRET + user.createdAt.getTime(),
//     options: { expiresIn: process.env.ACCESS_TOKEN },
//   });

//   return res.status(200).json({ success: true, accessToken: newAccessToken });
// };

import { roles, userModel } from "../../database/model/user.model.js";
import { charityModel, charityApprovalStatus } from "../../database/model/charity.model.js";
import { encryptPhone } from "../../utils/encryption/encryption.js";
import { hashPassword, comparePassword } from "../../utils/hashing/hashing.js";
import { createToken, verifyToken } from "../../utils/token/token.js";
import { customAlphabet } from "nanoid";
import { sendEmails } from '../../utils/sendemails/sendemail.nodemailer.js';
import { templet } from '../../utils/sendemails/generate.html.js';
import { codeOTP, otpModel } from "../../database/model/otp.model.js";
import { waitUntil } from '@vercel/functions';


// ===========================1) Register Account===========================
export const registerAccount = async (req, res, next) => {
  const { userName, email, phone, password, address, roleType } = req.body;

  if (roleType === roles.admin) {
    return next(new Error("Admin registration is not allowed", { cause: 403 }));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) return next(new Error("Email already exists", { cause: 409 }));

  if (req.body.nationalID) {
    req.body.nationalID = encryptPhone({ plainText: req.body.nationalID });
  }

  // ===== Charity: تحقق من البيانات الإضافية =====
  if (roleType === roles.charity) {
    const { licenseNumber, charityName } = req.body;
    if (!licenseNumber) return next(new Error("License number is required", { cause: 400 }));
    if (!charityName)   return next(new Error("Charity name is required",   { cause: 400 }));

    const licenseExists = await charityModel.findOne({ licenseNumber });
    if (licenseExists) return next(new Error("License number already registered", { cause: 409 }));
  }

  const passwordHash   = hashPassword({ plainText: password });
  const encryptedPhone = encryptPhone({ cipherText: phone });

  const newUser = await userModel.create({
    ...req.body,
    phone:    encryptedPhone,
    password: passwordHash,
  });

  // ===== Charity: إنشاء سجل الجمعية بـ approvalStatus: pending =====
  if (roleType === roles.charity) {
    const { licenseNumber, charityName, charityDescription } = req.body;
    const charityPhone = encryptPhone({ cipherText: phone });

    const charity = await charityModel.create({
      userId: newUser._id,
      charityName,
      licenseNumber,
      phone:charityPhone,
      address,
      description:    charityDescription || "No description provided",
      approvalStatus: charityApprovalStatus.pending,  // ← ينتظر موافقة الأدمن
    });

    if (!charity) {
      await userModel.findByIdAndDelete(newUser._id); // rollback
      return next(new Error("Failed to create charity profile", { cause: 500 }));
    }
  }

  // ===== OTP =====
  const sendCode = customAlphabet("0123456789", 6)();
  await otpModel.deleteMany({ userId: newUser._id, codeType: codeOTP.activateAccount });
  await otpModel.create({ userId: newUser._id, code: sendCode, codeType: codeOTP.activateAccount });
  waitUntil(sendEmails({ to: email, subject: codeOTP.activateAccount, html: templet({ sendCode }) }));

  const userData = await userModel.findById(newUser._id).select("-password -__v -phone -nationalID");
  return res.status(201).json({
    success: true,
    user:    userData,
    message: roleType === roles.charity
      ? "Charity registered successfully. Waiting for admin approval."
      : "User registered successfully. Please check your email for OTP.",
  });
};

// ===========================2) Login===========================
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid email or password", { cause: 404 }));

  const isValid = comparePassword({ plainText: password, hashPassword: user.password });
  if (!isValid) return next(new Error("Invalid email or password", { cause: 401 }));

  if (!user.verify) return next(new Error("Please verify your email first", { cause: 403 }));

  // ===== Charity: لازم الأدمن يوافق الأول =====
  if (user.roleType === roles.charity) {
    const charity = await charityModel.findOne({ userId: user._id });
    if (!charity) return next(new Error("Charity profile not found", { cause: 404 }));

    if (charity.approvalStatus === charityApprovalStatus.pending) {
      return next(new Error("Your account is pending admin approval", { cause: 403 }));
    }
    if (charity.approvalStatus === charityApprovalStatus.rejected) {
      return next(new Error(`Your account was rejected. Reason: ${charity.rejectionReason || "No reason provided"}`, { cause: 403 }));
    }
  }

  const accessToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret:  process.env.ACCESS_SECRET + user.createdAt.getTime(),
    options: { expiresIn: process.env.ACCESS_TOKEN },
  });

  const refreshToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret:  process.env.REFRESH_SECRET,
    options: { expiresIn: process.env.REFRESH_TOKEN },
  });

  return res.status(200).json({ success: true, message: "Logged in successfully", tokens: { accessToken, refreshToken } });
};

// ===========================3) Verify Email===========================
export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));
  if (user.verify) return next(new Error("Email already verified", { cause: 409 }));

  const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.activateAccount });
  if (!otpRecord) return next(new Error("Invalid or Expired OTP", { cause: 400 }));

  user.verify = true;
  await user.save();
  await otpModel.deleteOne({ _id: otpRecord._id });

  return res.status(200).json({ success: true, message: "Email verified successfully. You can login now." });
};

// ===========================4) Forget Password===========================
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const sendForget = customAlphabet("0123456789", 6)();
  await otpModel.deleteMany({ userId: user._id, codeType: codeOTP.forgetPassword });
  await otpModel.create({ userId: user._id, code: sendForget, codeType: codeOTP.forgetPassword });
  waitUntil(sendEmails({ to: email, subject: codeOTP.forgetPassword, html: templet({ sendCode: sendForget }) }));

  return res.status(200).json({ success: true, message: "Password reset OTP sent to your email." });
};

// ===========================5) Reset Password===========================
export const resetPassword = async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.forgetPassword });
  if (!otpRecord) return next(new Error("Invalid or Expired OTP", { cause: 400 }));

  user.password = hashPassword({ plainText: password });
  user.passwordChangedAt = new Date(); // إبطال كل التوكنات القديمة
  await user.save();
  await otpModel.deleteOne({ _id: otpRecord._id });

  return res.status(200).json({ success: true, message: "Password has been reset successfully." });
};

// ===========================6) Refresh Token===========================
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  const decoded = verifyToken({ token: refreshToken, secret: process.env.REFRESH_SECRET });
  if (!decoded?.id) return next(new Error("Invalid Token", { cause: 400 }));

  const user = await userModel.findById(decoded.id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const newAccessToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret:  process.env.ACCESS_SECRET + user.createdAt.getTime(),
    options: { expiresIn: process.env.ACCESS_TOKEN },
  });

  return res.status(200).json({ success: true, accessToken: newAccessToken });
};
