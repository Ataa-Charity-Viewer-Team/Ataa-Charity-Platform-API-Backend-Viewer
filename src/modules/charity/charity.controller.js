import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as charityService from "./charity.service.js";
import * as charityValidation from "./charity.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { charityEndpoint } from './charity.endpoint.js';

const router = Router();

router.get("/charities", authAction, authorization(charityEndpoint.getAllCharities), asyncHandler(charityService.getAllCharities));
router.post("/c", authAction, authorization(charityEndpoint.createCharity), validation(charityValidation.createCharitySchema), asyncHandler(charityService.createCharity));
router.get("/:id", authAction, authorization(charityEndpoint.getCharity), validation(charityValidation.charityIdSchema), asyncHandler(charityService.getCharity)); // ✓ getCharity
router.patch("/:id", authAction, authorization(charityEndpoint.updateCharity), validation(charityValidation.updateCharitySchema), asyncHandler(charityService.updateCharity));
router.delete("/:id", authAction, authorization(charityEndpoint.deleteCharity), validation(charityValidation.charityIdSchema), asyncHandler(charityService.deleteCharity));

export default router;