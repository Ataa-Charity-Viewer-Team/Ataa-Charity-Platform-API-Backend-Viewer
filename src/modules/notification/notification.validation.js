import joi from "joi";
import { monggoseID } from "../../middleware/validation.middleware.js";

export const NOTIFICATION_STATUS = [
  { en: "unread", ar: "غير مقروء" },
  { en: "read", ar: "مقروء" },
];

export const updatenotificationSchema = joi.object({
  id: monggoseID("Notification ID").required(),
  status: joi
    .string()
    .valid(...NOTIFICATION_STATUS.map(s => s.en),...NOTIFICATION_STATUS.map(s => s.ar))
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${NOTIFICATION_STATUS.map(s => s.ar).join(", ")}`,
    }),
});

export const deletenotificationSchema = joi.object({
  id: monggoseID("Notification ID").required().messages({
    "any.required": "Notification ID is required",
  }),
});