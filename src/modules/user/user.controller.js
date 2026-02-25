import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { userEndpoint } from "./user.endpoint.js";
const router = Router();
// ============================ get user ================================
router.get('/profile', authAction, authorization(userEndpoint.getProfile), asyncHandler(userService.getMyProfile));
// ============================ update user ================================
router.patch('/profile', authAction, authorization(userEndpoint.updateProfile), validation(userValidation.updateProfileSchema), asyncHandler(userService.updateMyProfile));
// =============================== change password ================================
router.patch('/changePassword', authAction, authorization(userEndpoint.changePassword), validation(userValidation.changePasswordSchema), asyncHandler(userService.changePassword));
// =============================== delete account ================================
router.delete('/account', authAction, authorization(userEndpoint.deleteAccount), asyncHandler(userService.deleteMyAccount));
// =============================== authorization admin =================================
// =============================== get all users ================================
router.get('/', authAction, authorization(userEndpoint.getAllUsers), asyncHandler(userService.getAllUsers));
// =============================== get user by id ================================
router.get('/:id', authAction, authorization(userEndpoint.getUser), validation(userValidation.getUserSchema), asyncHandler(userService.getUser));
// =============================== delete user ================================
router.delete('/:id', authAction, authorization(userEndpoint.deleteUser), validation(userValidation.deleteUserSchema), asyncHandler(userService.deleteUser));

export default router;




