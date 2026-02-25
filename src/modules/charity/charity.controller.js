import { Router } from "express";
import { asyncHandler } from "../../utils/error-handling/asynchandler.js";
import * as charityService from "./charity.service.js";
import * as charityValidation from "./charity.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { charityEndpoint } from './charity.endpoint.js';

const router = Router();

// ======================== GET all charities ========================
router.get("/charities", authAction, authorization(charityEndpoint.getAllCharities), asyncHandler(charityService.getAllCharities));

// ======================== CREATE charity ===========================
router.post("/charities", authAction, authorization(charityEndpoint.createCharity), validation(charityValidation.createCharitySchema), asyncHandler(charityService.createCharity));

// ======================== GET charity by ID ========================
router.get("/:id", authAction, authorization(charityEndpoint.getAllCharities), validation(charityValidation.charityIdSchema), asyncHandler(charityService.getCharity));

// ======================== UPDATE charity ===========================
router.patch("/:id", authAction, authorization(charityEndpoint.updateCharity), validation(charityValidation.updateCharitySchema), asyncHandler(charityService.updateCharity));

// ======================== DELETE charity ===========================
router.delete("/:id", authAction, authorization(charityEndpoint.deleteCharity), validation(charityValidation.charityIdSchema), asyncHandler(charityService.deleteCharity));

export default router;