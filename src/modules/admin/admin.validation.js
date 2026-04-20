import joi from "joi";
import { monggoseID } from "../../middleware/validation.middleware.js";

const status=["accepted", "rejected"];
export const updateDonationStatusSchema = joi.object({
  id: monggoseID("Donation ID").required(),
  status: joi.string()
    .valid(...status)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be: accepted or rejected",
    }),
});