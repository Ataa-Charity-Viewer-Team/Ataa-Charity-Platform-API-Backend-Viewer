// ================= Dependencies  imports  ======================
import joi from "joi";
import { checkFile } from "../../middleware/validation.middleware.js";
// =================1) Chat ======================
export const chatSchema = joi.object({
  message: joi.string().required().messages({
    "string.base": "Message must be a string",
    "string.empty": "Message cannot be empty",
    "any.required": "Message is required"
  }),
});

// =================2) Analysis ======================
export const analysisSchema = joi.object({
  message: joi.string().optional().messages({
    "string.base": "Message must be a string",
    "string.empty": "Message cannot be empty"
  }),
  file: checkFile(["image/jpeg", "image/png", "image/webp", "image/gif"]).min(1).max(5).required().messages({
    "string.base": "File must be a string",
    "string.empty": "File cannot be empty",
    "any.required": "File is required",
    "any.only": "File must be a valid image file"
  })
});