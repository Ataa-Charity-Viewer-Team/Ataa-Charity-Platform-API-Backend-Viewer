import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as evaluationService from "./evalution.service.js"
import * as evaluationValidation from "./evalution.validation.js"
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { evalutionEndpoint } from "./evalution.endpoint.js";

const router = Router();
// ====================== create evaluation ======================
router.post("/:donationId", authAction, authorization(evalutionEndpoint.createEvaluation), validation(evaluationValidation.createEvaluationSchema), asyncHandler(evaluationService.createEvaluation)
);
// ====================== get evaluation ======================
router.get("/:donationId", authAction, authorization(evalutionEndpoint.getEvaluation), validation(evaluationValidation.getEvaluationSchema), asyncHandler(evaluationService.getEvaluation)
);

export default router;