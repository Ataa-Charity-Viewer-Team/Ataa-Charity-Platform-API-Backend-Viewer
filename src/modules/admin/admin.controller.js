import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as adminService from "./admin.services.js";
import authAction from "../../middleware/authaction.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { adminEndpoint } from "./admin.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import { updateDonationStatusSchema } from "./admin.validation.js";

const router = Router();

// GET /admin/donations
router.get("/donations", authAction, authorization(adminEndpoint.getPendingDonations), asyncHandler(adminService.getPendingDonations));

// PATCH /admin/donation/:id
router.patch("/donation/:id", authAction, authorization(adminEndpoint.updateDonationStatus), validation(updateDonationStatusSchema), asyncHandler(adminService.updateDonationStatus));

export default router;