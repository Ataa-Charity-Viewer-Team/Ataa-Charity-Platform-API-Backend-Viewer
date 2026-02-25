import { Router } from "express";
import { asyncHandler } from "../../Utils/Error-Handling/asyncHandler.js";
import * as charityService from "./dashboard.service.js";
import * as  dashboardValidation from "./dashboard.validation.js";
import authAction from "../../Middleware/authaction.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { charityEndpoint } from "./dashboard.endpoint.js";
import { validation } from "../../Middleware/validation.middleware.js";

const router = Router();
// ====================== get stats ======================
router.get("/stats", authAction, authorization(charityEndpoint.getStats), asyncHandler(charityService.getStats));

router.get("/donations", authAction, authorization(charityEndpoint.getCharityDonations), asyncHandler(charityService.getCharityDonations));
// ====================== get requests ======================
router.get("/requests", authAction, authorization(charityEndpoint.getCharityRequests), asyncHandler(charityService.getCharityRequests));
// ====================== update request status ======================
router.patch("/request/:id", authAction, authorization(charityEndpoint.updateRequestStatus), validation(dashboardValidation.updateRequestStatusSchema), asyncHandler(charityService.updateRequestStatus));

export default router;