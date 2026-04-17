// ==================== report.schema.js ====================
import joi from "joi";

// ==================== Create Report ====================
export const createReportSchema = joi.object({
  type: joi.string().required().messages({
    "string.empty": "Report type is required",
    "any.required": "Report type is required",
  }),

  description: joi.string().min(10).max(500).trim()
  // .messages({
    // // "string.empty": "Report description is required",
    // "string.min": "Report description must be at least 10 characters",
    // "string.max": "Report description must not exceed 500 characters",
    // // "any.required": "Report description is required",
  // }),
});