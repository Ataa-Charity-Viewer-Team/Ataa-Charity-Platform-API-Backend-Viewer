// ========================== # Auth Service and send email vercel # =======================
import { roles, userModel } from "../../database/model/user.model.js";
import { charityModel } from "../../database/model/charity.model.js";
import { encryptPhone } from "../../utils/encryption/encryption.js";
import { hashPassword, comparePassword } from "../../utils/hashing/hashing.js";
import { createToken, verifyToken } from "../../utils/token/token.js";
import { customAlphabet } from "nanoid";
import { sendEmails } from '../../utils/sendemails/sendemail.nodemailer.js';
import { templet } from '../../utils/sendemails/generate.html.js';
import { codeOTP, otpModel } from "../../database/model/otp.model.js";
import { waitUntil } from '@vercel/functions';

// ===========================1) Register Account  ===========================
// export const registerAccount = async (req, res, next) => {
//   const { userName, email, phone, password, address, roleType, licenseNumber } = req.body;

//   const existingUser = await userModel.findOne({ email });
//   if (existingUser) {
//     return next(new Error("Email already exists", { cause: 409 }));
//   }

//   if (req.body.nationalID) {
//     req.body.nationalID = encryptPhone({ plainText: req.body.nationalID });
//   }
//     // 🔥 3️⃣ لو Charity → هات الـ admin
//   let adminUser = null;

//   if (roleType === roles.charity) {
//     if (!licenseNumber) {
//       return next(new Error("License number is required", { cause: 400 }));
//     }

// const charity = await charityModel.findOne({
//   licenseNumber
// });
//     if (!charity) {
//       return next(new Error("No charity found with this license number", { cause: 404 }));
//     }
//     adminUser = await userModel.findById(charity.userId);
//   }

//   const passwordHash = hashPassword({ plainText: password });
//   const encryptedPhone = encryptPhone({ cipherText: phone });

//   const newUser = await userModel.create({ ...req.body, phone: encryptedPhone, password: passwordHash });
//    // 🔥 5️⃣ نقل الملكية
//   if (roleType === roles.charity) {

//     const charity = await charityModel.findOne({
//       userId: adminUser._id
//     });

//     if (!charity) {
//       await userModel.findByIdAndDelete(newUser._id); // rollback
//       return next(new Error("Charity already claimed or not found", { cause: 400 }));
//     }

//     charity.userId = newUser._id;
//     await charity.save();
//   }
//   const userData = await userModel.findById(newUser._id).select("-password -__v -phone -nationalId");
//   const sendCode = customAlphabet("0123456789", 6)();
//   await otpModel.deleteMany({ userId: newUser._id, codeType: codeOTP.activateAccount });
//   await otpModel.create({ userId: newUser._id, code: sendCode, codeType: codeOTP.activateAccount });

//   waitUntil(sendEmails({ to: email, subject: codeOTP.activateAccount, html: templet({ sendCode }) }));

//   return res.status(201).json({ success: true, user: userData, message: "User registered successfully. Please check your email for OTP." });
// };
export const registerAccount = async (req, res, next) => {
  const {userName,email, phone,password,address,roleType,licenseNumber,} = req.body;

  // 🔥 1) check email
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  // 🔥 2) encrypt national ID (if exists)
  if (req.body.nationalID) {
    req.body.nationalID = encryptPhone({
      plainText: req.body.nationalID,
    });
  }

  let charity = null;

  // 🔥 3) Charity flow only
  if (roleType === roles.charity) {
    if (!licenseNumber) {
      return next(
        new Error("License number is required", { cause: 400 })
      );
    }

    // 🔍 find charity by licenseNumber
    charity = await charityModel.findOne({ licenseNumber });

    if (!charity) {
      return next(
        new Error("No charity found with this license number", {
          cause: 404,
        })
      );
    }

    // optional: check if already claimed
    if (charity.userId) {
      return next(
        new Error("Charity already claimed", { cause: 400 })
      );
    }
  }

  // 🔥 4) hash + encrypt
  const passwordHash = hashPassword({ plainText: password });
  const encryptedPhone = encryptPhone({ plainText: phone });

  // 🔥 5) create user
  const newUser = await userModel.create({
    ...req.body,
    phone: encryptedPhone,
    password: passwordHash,
  });

  // 🔥 6) transfer ownership
  if (roleType === roles.charity && charity) {
    charity.userId = newUser._id;
    await charity.save();
  }

  // 🔥 7) remove sensitive data
  const userData = await userModel
    .findById(newUser._id)
    .select("-password -__v -phone -nationalID");

  // 🔥 8) OTP
  const sendCode = customAlphabet("0123456789", 6)();

  await otpModel.deleteMany({
    userId: newUser._id,
    codeType: codeOTP.activateAccount,
  });

  await otpModel.create({
    userId: newUser._id,
    code: sendCode,
    codeType: codeOTP.activateAccount,
  });

  waitUntil(
    sendEmails({
      to: email,
      subject: codeOTP.activateAccount,
      html: templet({ sendCode }),
    })
  );

  return res.status(201).json({
    success: true,
    user: userData,
    message:
      "User registered successfully. Please check your email for OTP.",
  });
};

// ===========================2) Login  ===========================
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid email or password", { cause: 404 }));

  const isValid = comparePassword({ plainText: password, hashPassword: user.password });
  if (!isValid) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }

  if (!user.verify) {
    return next(new Error("Please verify your email first", { cause: 403 }));
  }

  const accessToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
    options: { expiresIn: process.env.ACCESS_TOKEN }
  });

  const refreshToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret: process.env.REFRESH_SECRET,
    options: { expiresIn: process.env.REFRESH_TOKEN }
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    tokens: { accessToken, refreshToken }
  });
};

// ===========================3) Verify Email ===========================
export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.verify) {
    return next(new Error("Email already verified", { cause: 409 }));
  }

  const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.activateAccount });
  if (!otpRecord) {
    return next(new Error("Invalid or Expired OTP", { cause: 400 }));
  }

  user.verify = true;
  await user.save();
  await otpModel.deleteOne({ _id: otpRecord._id });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully. You can login now."
  });
};

// ====================4) Forget Password  =======================
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const sendForget = customAlphabet("0123456789", 6)();
  await otpModel.deleteMany({ userId: user._id, codeType: codeOTP.forgetPassword });
  await otpModel.create({ userId: user._id, code: sendForget, codeType: codeOTP.forgetPassword });

  waitUntil(sendEmails({ to: email, subject: codeOTP.forgetPassword, html: templet({ sendCode: sendForget }) }));

  return res.status(200).json({
    success: true,
    message: "Password reset OTP sent to your email."
  });
};

// ===========================5) Reset Password ===========================
export const resetPassword = async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const otpRecord = await otpModel.findOne({ userId: user._id, code, codeType: codeOTP.forgetPassword });
  if (!otpRecord) {
    return next(new Error("Invalid or Expired OTP", { cause: 400 }));
  }

  user.password = hashPassword({ plainText: password });
  await user.save();
  await otpModel.deleteOne({ _id: otpRecord._id });

  return res.status(200).json({ success: true, message: "Password has been reset successfully." });
};

// ===========================6) Refresh Token ===========================
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  const decoded = verifyToken({ token: refreshToken, secret: process.env.REFRESH_SECRET });
  if (!decoded?.id) {
    return next(new Error("Invalid Token", { cause: 400 }));
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const newAccessToken = createToken({
    payload: { id: user._id, roleType: user.roleType },
    secret: process.env.ACCESS_SECRET + user.createdAt.getTime(),
    options: { expiresIn: process.env.ACCESS_TOKEN }
  });

  return res.status(200).json({ success: true, accessToken: newAccessToken });
};