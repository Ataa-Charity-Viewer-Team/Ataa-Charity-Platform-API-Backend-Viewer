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
import { checkBlocked } from "./middleware/blockuser.middleware.js";
import routerBlock from "./modules/blockuser/blockuser.controller.js"

export const bootstrap = async (app, express) => {
  app.use(cors({
    origin: "*"
  }))
  // ================= trust proxy ==================
  app.set("trust proxy", 1);

  // ================= npm helmet (security) ==================
  app.use(helmet());

  // ================= limit request =====================
  app.use(limiter);
  // ================= connect to database ===================
  await connectDB();
  // ==================== check block ip user ============================
  app.get("/myip", (req, res) => {
  res.json({
    forwarded: req.headers['x-forwarded-for'],
    remoteAddress: req.socket.remoteAddress,
    allHeaders: req.headers
  });
});
  app.use(checkBlocked);
  // ============================ import controllers (endpoints) ============================
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/donor", donationRouter);
  app.use("/charity", charityRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/rating", evalutionRouter);
  app.use("/report", reportRouter);
  app.use("/ai", aiRouter);
  app.use("/notification", notificationRouter);
  app.use("/block",routerBlock)
  // ======================= import error handlers ============================
  app.use(notFoundHandler);


  // =============================== global error ====================
  app.use(globalErrorHandler);
}

