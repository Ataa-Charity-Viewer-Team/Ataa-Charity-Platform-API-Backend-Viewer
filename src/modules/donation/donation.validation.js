import joi from "joi";
import { monggoseID, checkFile } from "../../middleware/validation.middleware.js";

// ==================== Constants ====================
export const donationTypes = [
  { ar: "رجالي", en: "Men" },
  { ar: "حريمي", en: "Women" },
  { ar: "أطفال", en: "Kids" },
];

export const DONATION_STATUS = {
  pending:  { en: "pending",  ar: "قيد الانتظار" },
  accepted: { en: "accepted", ar: "مقبول" },
  rejected: { en: "rejected", ar: "مرفوض" },
};

export const donationCondition = ["جديدة", "مقبولة", "جيدة", "ممتازة"];
export const DONATION_SIZE = ["XS","S","M","L","XL","XXL","3XL","4XL","5XL"];

const STATUS_VALUES_EN  = Object.values(DONATION_STATUS).map(s => s.en);
const STATUS_VALUES_AR  = Object.values(DONATION_STATUS).map(s => s.ar);
const STATUS_VALUES_ALL = [...STATUS_VALUES_EN, ...STATUS_VALUES_AR];

// ==================== Item Sub-Schema ====================
const itemSchema = joi.object({
  type: joi.string()
    .valid(...donationTypes.map(t => t.en), ...donationTypes.map(t => t.ar))
    .required()
    .messages({
      "any.required": "Type is required",
      "any.only": `Type must be one of: ${donationTypes.map(t => t.ar).join(", ")}`,
    }),

  size: joi.string()
    .valid(...DONATION_SIZE)
    .required()
    .messages({
      "any.required": "Size is required",
      "any.only": `Size must be one of: ${DONATION_SIZE.join(", ")}`,
    }),

  quantity: joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "any.required": "Quantity is required",
      "number.min": "Quantity must be at least 1",
      "number.integer": "Quantity must be a whole number",
    }),

  condition: joi.string()
    .valid(...donationCondition)
    .required()
    .messages({
      "any.required": "Condition is required",
      "any.only": `Condition must be one of: ${donationCondition.join(", ")}`,
    }),
});

// ==================== 1) Create Donation ====================
export const createDonationSchema = joi.object({
  charityId: monggoseID("charityId").required(),

  items: joi.alternatives().try(
    joi.array().items(itemSchema).min(1).max(10),
    joi.string()
  ).required().messages({
    "any.required": "Items are required",
    "alternatives.match": "Items must be a valid array or JSON string",
  }),

  description: joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),

  file: checkFile(["image/jpeg", "image/png", "image/webp", "image/gif"])
    .min(1)
    .max(15)
    .required()
    .messages({
      "array.min": "At least 1 image is required",
      "array.max": "You can upload up to 15 images",
      "any.required": "File is required",
    }),
});

// ==================== 2) Update Donation Status ====================
export const updateDonationStatusSchema = joi.object({
  id: monggoseID("Donation ID").required(),

  status: joi.string()
    .valid(...STATUS_VALUES_ALL)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${STATUS_VALUES_AR.join(", ")}`,
    }),
});

// ==================== 3) Accept Donation (Charity) ====================
export const acceptDonationSchema = joi.object({
  id: monggoseID("Donation ID").required(),
});

// ==================== 4) Update Request Status (Charity) ====================
export const updateRequestStatusSchema = joi.object({
  id: monggoseID("Request ID").required(),

  status: joi.string()
    .valid(...STATUS_VALUES_ALL)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${STATUS_VALUES_AR.join(", ")}`,
    }),
});