// ==================== notification.schema.js ====================
import joi from "joi";
import { monggoseID } from "../../Middleware/validation.middleware.js";
// ==================== Constants ====================
const NOTIFICATION_STATUS = ["unread", "read"];

export const updatenotificationSchema = joi.object({
  id: monggoseID("Notification ID").required(),
  status: joi
    .string()
    .valid(...NOTIFICATION_STATUS)
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${NOTIFICATION_STATUS.join(", ")}`,
    }),
});

export const deletenotificationSchema = joi.object({
  id: monggoseID("Notification ID").required(),
});