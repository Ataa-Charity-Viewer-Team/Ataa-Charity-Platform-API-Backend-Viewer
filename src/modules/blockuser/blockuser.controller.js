import express from "express";
import { blockUser, unblockUser, getBlockedUsers } from "./blockuser.services.js";

const router = express.Router();

router.post("/", blockUser);
router.delete("/", unblockUser);
router.get("/", getBlockedUsers);

export default router;