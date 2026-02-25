import { Router } from "express";
import { asyncHandler } from "../../Utils/Error-Handling/asyncHandler.js";
import * as notificationService from "./notfication.service.js";
import * as notificationValidation from "./notfication.validation.js";
import authAction from "../../Middleware/authaction.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
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