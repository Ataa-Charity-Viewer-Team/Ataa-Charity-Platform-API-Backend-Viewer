import joi from "joi";
import { monggoseID } from "../../middleware/validation.middleware.js";

// ==================== Regex ====================
const phoneRegex = /^(002|\+2)?01[0125][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|edu)$/

// ==================== Charity ID Schema ====================
export const charityIdSchema = joi.object({
  id: monggoseID("Charity ID").required(),
});

// ==================== 1) Create Charity ====================
export const createCharitySchema = joi.object({
  charityName: joi
    .string()
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages({
      "any.required": "Charity name is required",
      "string.min": "Charity name must be at least 3 characters",
      "string.max": "Charity name must not exceed 30 characters",
      "string.empty": "Charity name is required",
    }),

  email: joi
    .string()
    .pattern(emailRegex)
    .lowercase()
    .trim()
    .required()
    .messages({
      "any.required": "Email is required",
      "string.pattern.base": "Invalid email format",
      "string.empty": "Email is required",
    }),

  phone: joi
    .string()
    .pattern(phoneRegex)
    .required()
    .messages({
      "any.required": "Phone is required",
      "string.pattern.base": "Invalid phone format",
      "string.empty": "Phone is required",
    }),

  address: joi
    .string()
    .min(5)
    .max(100)
    .trim()
    .required()
    .messages({
      "any.required": "Address is required",
      "string.min": "Address must be at least 5 characters",
      "string.max": "Address must not exceed 100 characters",
      "string.empty": "Address is required",
    }),

  description: joi
    .string()
    .min(10)
    .max(500)
    .trim()
    .required()
    .messages({
      "any.required": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must not exceed 500 characters",
      "string.empty": "Description is required",
    }),
    licenseNumber: joi.string().length(8)
});

// ==================== 2) Update Charity ====================
export const updateCharitySchema = joi
  .object({
    id: monggoseID("Charity ID").required(),

    charityName: joi
      .string()
      .min(3)
      .max(30)
      .trim()
      .messages({
        "string.min": "Charity name must be at least 3 characters",
        "string.max": "Charity name must not exceed 30 characters",
      }),

    email: joi
      .string()
      .pattern(emailRegex)
      .lowercase()
      .trim()
      .messages({
        "string.pattern.base": "Invalid email format",
      }),

    phone: joi
      .string()
      .pattern(phoneRegex)
      .messages({
        "string.pattern.base": "Invalid phone format",
      }),

    address: joi
      .string()
      .min(5)
      .max(100)
      .trim()
      .messages({
        "string.min": "Address must be at least 5 characters",
        "string.max": "Address must not exceed 100 characters",
      }),

    description: joi
      .string()
      .min(10)
      .max(500)
      .trim()
      .messages({
        "string.min": "Description must be at least 10 characters",
        "string.max": "Description must not exceed 500 characters",
      }),
  })
  .or("charityName", "email", "phone", "address", "description")
  .messages({
    "object.missing": "At least one field must be provided",
  });