// ===================== import modules =====================
import connectDB from "./database/connect.js"
import { notFoundHandler } from "./utils/errorhandling/notfoundhandler.js"
import { globalErrorHandler } from './utils/errorhandling/globalhandler.js';
import authRouter from "./modules/auth/auth.controller.js"
import userRouter from "./modules/user/user.controller.js"
import charityRouter from "./modules/charity/charity.controller.js"
import dashboardRouter from "./modules/charity_dashboard/dashboard.controller.js"
import donationRouter from "./modules/donation/donation.controller.js"
import evalutionRouter from "./modules/evaluation/evalution.controller.js"
import reportRouter from "./modules/report/report.controller.js"
import aiRouter from "./modules/ai/ai.controller.js"
import limiter from "./middleware/express.limit.middleware.js";
import helmet from "helmet";
import notificationRouter from "./modules/notification/notification.controller.js";
import cors from "cors"
import cronRouter from "./cron/cron.controller.js";

export const bootstrap = async (app, express) => {
  app.use(cors({
    origin: "*"
  }))
  // ================= trust proxy ==================
  app.set("trust proxy", 1);

  // ================= npm helmet (security) ==================
  app.use(helmet());

  // ================= connect to database ===================
  await connectDB();
  // ============================ Vercel Cron Endpoints ============================
  app.use("/cron", cronRouter);
  // ================= limit request =====================
  app.use(limiter);
  // ============================ import controllers (endpoints) ============================
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/donor", donationRouter);
  app.use("/charity", charityRouter);
  app.use("/dashboard/:charityId", dashboardRouter);
  app.use("/rating", evalutionRouter);
  app.use("/report", reportRouter);
  app.use("/ai", aiRouter);
  app.use("/notification", notificationRouter);
  // ======================= import error handlers ============================
  app.use(notFoundHandler);
  // =============================== global error ====================
  app.use(globalErrorHandler);
}


