import joi from "joi";
import { monggoseID, checkFile } from "../../Middleware/validation.middleware.js";

// ==================== Constants ====================
const DONATION_TYPES = ["رجالي", "حريمي", "أطفال"];
const DONATION_STATUS = ["pending", "accepted", "rejected", "delivered"];

// ==================== 1) Create Donation ====================
export const createDonationSchema = joi.object({
  charityId: monggoseID("Charity ID").required(),

  type: joi.string().valid(...DONATION_TYPES).required().messages({
    "any.required": "Type is required",
    "any.only": `Type must be one of ${DONATION_TYPES.join(", ")}`,
  }),

  size: joi.number().integer().min(1).required().messages({
    "any.required": "Size is required",
    "number.min": "Size must be at least 1",
    "number.integer": "Size must be a whole number",
  }),

  quantity: joi.number().integer().min(1).required().messages({
    "any.required": "Quantity is required",
    "number.min": "Quantity must be at least 1",
    "number.integer": "Quantity must be a whole number",
  }),

  description: joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),

  file: checkFile(["image/jpeg", "image/png", "image/webp", "image/gif"])
    .max(5)
    .required()
    .messages({
      "string.base": "File must be a string",
      "string.empty": "File cannot be empty",
      "any.required": "File is required",
    }),
});

// ==================== 2) Update Donation Status (Donor) ====================
export const updateDonationStatusSchema = joi.object({
  id: monggoseID("Donation ID").required(),

  status: joi.string().valid(...DONATION_STATUS).required().messages({
    "any.required": "Status is required",
    "any.only": `Status must be one of ${DONATION_STATUS.join(", ")}`,
  }),
});

// ==================== 3) Accept Donation (Charity) ====================
export const acceptDonationSchema = joi.object({
  id: monggoseID("Donation ID").required(),
});

// ==================== 4) Update Request Status (Admin/Charity) ====================
export const updateRequestStatusSchema = joi.object({
  id: monggoseID("Request ID").required(),

  status: joi.string().valid(...DONATION_STATUS).required().messages({
    "any.required": "Status is required",
    "any.only": `Status must be one of ${DONATION_STATUS.join(", ")}`,
  }),
});