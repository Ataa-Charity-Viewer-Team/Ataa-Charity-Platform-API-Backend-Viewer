// ==================== evaluation.schema.js ====================
import joi from "joi";
import { monggoseID } from "../../Middleware/validation.middleware.js";

// ==================== 1) Create Evaluation ====================
export const createEvaluationSchema = joi.object({
  donationId: monggoseID("Donation ID").required(),

  rating: joi
    .number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Rating must be a number",
      "number.integer": "Rating must be a whole number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must not exceed 5",
      "any.required": "Rating is required",
    }),

  comment: joi
    .string()
    .min(3)
    .max(500)
    .trim()
    .optional()
    .messages({
      "string.min": "Comment must be at least 3 characters",
      "string.max": "Comment must not exceed 500 characters",
    }),
});

// ==================== 2) Get Evaluation ====================
export const getEvaluationSchema = joi.object({
  donationId: monggoseID("Donation ID").required(),
});