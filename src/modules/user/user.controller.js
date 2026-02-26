import { Router } from "express";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
import authAction from "../../middleware/authaction.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { userEndpoint } from "./user.endpoint.js";

const router = Router();

router.get('/', authAction, authorization(userEndpoint.getAllUsers), asyncHandler(userService.getAllUsers));
router.get('/profile', authAction, authorization(userEndpoint.getProfile), asyncHandler(userService.getMyProfile));
router.patch('/changePassword', authAction, authorization(userEndpoint.changePassword), validation(userValidation.changePasswordSchema), asyncHandler(userService.changePassword));
router.patch('/profile', authAction, authorization(userEndpoint.updateProfile), validation(userValidation.updateProfileSchema), asyncHandler(userService.updateMyProfile));
router.delete('/account', authAction, authorization(userEndpoint.deleteAccount), asyncHandler(userService.deleteMyAccount));
router.get('/:id', authAction, authorization(userEndpoint.getUser), validation(userValidation.getUserSchema), asyncHandler(userService.getUserById)); 
router.delete('/:id', authAction, authorization(userEndpoint.deleteUser), validation(userValidation.deleteUserSchema), asyncHandler(userService.deleteUser));

export default router;