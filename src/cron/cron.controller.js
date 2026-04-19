
import { Router } from "express";
import { asyncHandler } from "../utils/errorhandling/asynchandler.js";
import * as cronServices from "./cron.services.js";
import authAction from './../middleware/authaction.middleware.js';
import { authorization } from './../middleware/authorization.middleware.js';
import { cronEndpoint } from "./cron.endpoint.js";

const router = Router();

router.get("/adminReport",authAction,authorization(cronEndpoint.adminReport),asyncHandler(cronServices.adminReport));

router.get("/donationReminder",
  authAction,
  authorization(cronEndpoint.donationReminder),
  asyncHandler(cronServices.donationReminder)
);

export default router;