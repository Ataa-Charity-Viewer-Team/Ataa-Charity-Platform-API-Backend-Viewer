import joi from "joi";
import { monggoseID } from "../../middleware/validation.middleware.js";
// ==================== Constants ====================
const DONATION_STATUS = ["pending", "accepted", "rejected"];

// ==================== 1) Update Request Status ====================
export const updateRequestStatusSchema = joi.object({
  id: monggoseID("Donation ID").required(),
  status: joi
    .string()
    .valid(...DONATION_STATUS)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: pending, accepted, rejected`,
    }),
});