// =====================   import modules =====================
import { Router } from "express"
import { asyncHandler } from '../../utils/errorhandling/asynchandler.js';
import * as authValidation from "./auth.validation.js"
import * as authService from "./auth.service.js"
import { validation } from "../../middleware/validation.middleware.js";
// =====================   AUTH CONTROLLER =====================
const router = Router()
// ===================== Register =====================
router.post("/register", validation(authValidation.registerSchema), asyncHandler(authService.registerAccount))
// ===================== Login =====================
router.post("/login", validation(authValidation.loginSchema), asyncHandler(authService.login))
// ===================== verify email =====================
router.post("/verifyEmail", validation(authValidation.verifyEmailSchema), asyncHandler(authService.verifyEmail))
// ===================== Forget Password =====================
router.post("/forgetPassword", validation(authValidation.forgetPasswordSchema), asyncHandler(authService.forgetPassword))
// ===================== Reset Password =====================
router.post("/resetPassword", validation(authValidation.resetPasswordSchema), asyncHandler(authService.resetPassword))
// ===================== Refersh Token ==================================
router.post("/refreshToken", validation(authValidation.refreshTokenSchema), asyncHandler(authService.refreshToken))

export default router