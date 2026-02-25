// =================== import modules ===================
import { Router } from "express";
import { asyncHandler } from '../../utils/errorhandling/asynchandler.js';
import { uploadFile } from "../../utils/uploadfile/multer.upload.js";
import * as chatServices from "./ai.services.js"
import authAction from '../../middleware/authaction.middleware.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as validationSchema from "./ai.validation.js"
// =================== Router AI ===================
const router = Router()
// ========================== AI Create Chat ==========================
router.post('/chat', authAction, validation(validationSchema.chatSchema), asyncHandler(chatServices.chat));
// ========================== AI analysis Image (Analsise) ==========================
router.post('/analysis', authAction, uploadFile().array('data', 5), validation(validationSchema.analysisSchema), asyncHandler(chatServices.analysis));
// ========================== AI analysis Image (Analsise) ==========================
export default router


