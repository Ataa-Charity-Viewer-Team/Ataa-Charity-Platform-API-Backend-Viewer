// ==================== report.schema.js ====================
import joi from "joi";

// ==================== Create Report ====================
export const createReportSchema = joi.object({
  description: joi
    .string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must not exceed 500 characters",
      "any.required": "Description is required",
    }),
});





