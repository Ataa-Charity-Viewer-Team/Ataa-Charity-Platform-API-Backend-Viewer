import { Router } from "express";
import { asyncHandler } from "../../Utils/Error-Handling/asyncHandler.js";
import * as reportService from "./report.service.js";
import * as reportValidation from "./report.validation.js";
import authAction from "../../Middleware/authaction.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { reportEndpoint } from "./report.endpoint.js";
const router = Router();
// =========================== report create ===========================
router.post("/", authAction, authorization(reportEndpoint.createReport), validation(reportValidation.createReportSchema), asyncHandler(reportService.createReport)
);
// =========================== report get all ===========================
router.get("/allReports", authAction, authorization(reportEndpoint.getAllReports), asyncHandler(reportService.getAllReports));

export default router;