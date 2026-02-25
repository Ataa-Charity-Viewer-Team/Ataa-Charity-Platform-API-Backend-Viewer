// donation.controller.js
import { Router } from "express";
import { asyncHandler } from "../../Utils/Error-Handling/asyncHandler.js";
import * as donationService from "./donation.service.js";
import * as donationValidation from "./donation.validation.js";
import authAction from "../../Middleware/authaction.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { uploadFile } from "../../Utils/UploadFile/multer.upload.js";
import { donationEndpoint } from "./donation.endpoint.js";

const router = Router();
// ========================== donation create ===========================
router.post("/", authAction, authorization(donationEndpoint.createDonation), uploadFile().array("images", 5), validation(donationValidation.createDonationSchema), asyncHandler(donationService.createDonation));
// ========================== donation get my donations ===========================
router.get("/", authAction, authorization(donationEndpoint.getMyDonations), asyncHandler(donationService.getMyDonations));

export default router;
