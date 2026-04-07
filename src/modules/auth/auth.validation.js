// =================================== Validation Schema auth ===================================
import joi from "joi";

// ==================== Regex ====================
const nameRegex = /^[a-zA-Z\u0621-\u064A][^#&<>"~;$^%{}]{2,29}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const phoneRegex = /^(002|\+2)?01[0125][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|edu)$/
// ==================== 1) Register ====================
export const registerSchema = joi.object({
  userName: joi
    .string()
    .min(3)
    .max(30)
    .trim()
    .pattern(nameRegex)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must not exceed 30 characters",
      "string.pattern.base": "Name must contain only letters and valid characters",
      "any.required": "Name is required"}),

  email: joi
    .string()
    .pattern(emailRegex) 
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Invalid email format",
      "any.required": "Email is required",
    }),

  phone: joi
    .string()
    .pattern(phoneRegex)
    .required()
    .messages({
      "string.empty": "Phone is required",
      "string.pattern.base": "Invalid phone format",
      "any.required": "Phone is required",
    }),

  password: joi
    .string()
    .min(8)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and number",
      "any.required": "Password is required",
    }),

  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),

  address: joi
    .string()
    .min(5)
    .max(100)
    .trim()
    .required()
    .messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters",
      "string.max": "Address must not exceed 100 characters",
      "any.required": "Address is required",
    }),
    roleType: joi
    .string()
    .valid('user', 'charity', 'admin')
    .default('user')
    .messages({
      "any.only": "Role must be user, charity, or admin"
})  
});

// ==================== 2) Login ====================
export const loginSchema = joi.object({
  email: joi
    .string()
    .pattern(emailRegex)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: joi
    .string()
    .min(8)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base": "Invalid password format",
      "any.required": "Password is required",
    }),
});

// ==================== 3) Verify Email ====================
export const verifyEmailSchema = joi.object({
  email: joi
    .string()
    .pattern(emailRegex)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Invalid email format",
      "any.required": "Email is required",
    }),

  code: joi
    .string()
    .length(6)
    .required()
    .messages({
      "string.empty": "Code is required",
      "string.length": "Code must be 6 digits",
      "any.required": "Code is required",
    }),
});

// ==================== 4) Forget Password ====================
export const forgetPasswordSchema = joi.object({
  email: joi
    .string()
    .pattern(emailRegex)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Invalid email format",
      "any.required": "Email is required",
    }),
});

// ==================== 5) Reset Password ====================
export const resetPasswordSchema = joi.object({
  email: joi
    .string()
    .pattern(emailRegex)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Invalid email format",
      "any.required": "Email is required",
    }),

  code: joi
    .string()
    .length(6)
    .required()
    .messages({
      "string.empty": "Code is required",
      "string.length": "Code must be 6 digits",
      "any.required": "Code is required",
    }),

  password: joi
    .string()
    .min(8)
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base": "Invalid password format",
      "any.required": "Password is required"
    }),

  confirmPassword: joi
    .string()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

// ==================== 6) Refresh Token ====================
export const refreshTokenSchema = joi.object({
  refreshToken: joi
    .string()
    .required()
    .messages({
      "string.empty": "Refresh token is required",
      "any.required": "Refresh token is required",
    }),
});