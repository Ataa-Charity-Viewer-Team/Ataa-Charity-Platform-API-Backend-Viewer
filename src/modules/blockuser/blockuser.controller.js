import express from "express";
import { blockUser, unblockUser, getBlockedUsers } from "./blockuser.services.js";
import { asyncHandler } from "../../utils/errorhandling/asynchandler.js";

const router = express.Router();

router.post("/",asyncHandler(blockUser));
router.delete("/", asyncHandler(unblockUser));
router.get("/", asyncHandler(getBlockedUsers));

export default router;