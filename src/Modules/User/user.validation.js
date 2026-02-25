import joi from "joi";
import { monggoseID } from "../../Middleware/validation.middleware.js";
// =================1)  Update Profile ======================
export const updateProfileSchema = joi.object({
  userName: joi.string().min(3).max(30).trim().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 30 characters"
  }),
  phone: joi.string().messages({
    "string.empty": "Phone cannot be empty"
  }),
  address: joi.string().min(5).max(100).trim().messages({
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address must not exceed 100 characters"
  }),
}).or("userName", "phone", "address").messages({
  "object.missing": "At least one field must be provided",
});
// =================2) Change Password ======================
export const changePasswordSchema = joi.object({
  oldPassword: joi.string().min(8).required().messages({
    "string.empty": "Old password is required",
    "string.min": "Old password must be at least 8 characters"
  }),
  newPassword: joi.string().min(8).invalid(joi.ref("oldPassword")).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 8 characters",
    "any.invalid": "New password must be different from old password"
  }),
  confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
    "string.empty": "Confirm password is required",
    "any.only": "Passwords do not match"
  }),
});
// =================3) Get User ======================
export const getUserSchema = joi.object({ id: monggoseID("User ID").required() });
// =================4) Delete User ======================
export const deleteUserSchema = joi.object({ id: monggoseID("User ID").required() });