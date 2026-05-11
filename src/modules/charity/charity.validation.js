import joi from "joi";
import { monggoseID } from "../../middleware/validation.middleware.js";

// ==================== Regex ====================
const phoneRegex = /^(002|\+2)?01[0125][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|edu)$/;

// ==================== Charity ID Schema ====================
export const charityIdSchema = joi.object({
  id: monggoseID("Charity ID").required(),
});


// ==================== 1) Update Charity ====================
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

// ==================== 2) Delete Charity ====================
export const deleteCharitySchema = joi.object({
  id: monggoseID("Charity ID").required(),
});

// ==================== 3) Admin: Approve Charity ====================
export const approveCharitySchema = joi.object({
  id: monggoseID("Charity ID").required(),
});

// ==================== 4) Admin: Reject Charity ====================
export const rejectCharitySchema = joi.object({
  id: monggoseID("Charity ID").required(),

  rejectionReason: joi
    .string()
    .min(10)
    .max(300)
    .trim()
    .required()
    .messages({
      "any.required": "Rejection reason is required",
      "string.empty": "Rejection reason cannot be empty",
      "string.min": "Rejection reason must be at least 10 characters",
      "string.max": "Rejection reason must not exceed 300 characters",
    }),
});


