import { Router } from "express";
import { asyncHandler } from "../../utils/error-handling/asynchandler.js";
import * as notificationService from "./notfication.service.js";
import * as notificationValidation from "./notfication.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { notificationEndpoint } from "./notfication.endpoint.js";

const router = Router();
// ========================== notification get all ===========================
router.get("/", authAction, authorization(notificationEndpoint.getAllnotifications), asyncHandler(notificationService.getAllnotifications));
// ========================== notification mark all as read ===========================
router.patch("/", authAction, authorization(notificationEndpoint.markAllAsRead), asyncHandler(notificationService.markAllAsRead));
// ========================== notification get one ===========================
router.patch("/:id", authAction, authorization(notificationEndpoint.updatenotification), validation(notificationValidation.updatenotificationSchema), asyncHandler(notificationService.updatenotification));
// ========================== notification delete ===========================
router.delete("/:id", authAction, authorization(notificationEndpoint.deletenotification), validation(notificationValidation.deletenotificationSchema), asyncHandler(notificationService.deletenotification));

export default router;