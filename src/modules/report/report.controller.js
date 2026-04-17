import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as reportService from "./report.service.js";
import * as reportValidation from "./report.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { reportEndpoint } from "./report.endpoint.js";
const router = Router();
// =========================== report create ===========================
router.post("/addReport", authAction, authorization(reportEndpoint.createReport), validation(reportValidation.createReportSchema), asyncHandler(reportService.createReport)
);
// =========================== report get all ===========================
router.get("/allReports", authAction, authorization(reportEndpoint.getAllReports), asyncHandler(reportService.getAllReports));

export default router;




