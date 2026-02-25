// =================== import modules ===================
import { Router } from "express";
import { asyncHandler } from './../../Utils/Error-Handling/asyncHandler.js';
import { uploadFile } from "../../Utils/UploadFile/multer.upload.js";
import * as chatServices from "./../../Modules/AI/ai.services.js"
import authAction from '../../Middleware/authaction.middleware.js';
import { validation } from "../../Middleware/validation.middleware.js";
import * as validationSchema from "./../../Modules/AI/ai.validation.js"
// =================== Router AI ===================
const router = Router()
// ========================== AI Create Chat ==========================
router.post('/chat', authAction, validation(validationSchema.chatSchema), asyncHandler(chatServices.chat));
// ========================== AI analysis Image (Analsise) ==========================
router.post('/analysis', authAction, uploadFile().array('data', 5), validation(validationSchema.analysisSchema), asyncHandler(chatServices.analysis));
// ========================== AI analysis Image (Analsise) ==========================
export default router


