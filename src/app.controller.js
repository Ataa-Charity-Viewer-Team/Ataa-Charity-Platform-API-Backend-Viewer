// ===================== import modules =====================
import connectDB from "./database/connect.js"
import { notFoundHandler } from "./utils/error-handling/notfoundhandler.js"
import { globalErrorHandler } from './utils/error-handling/globalhandler.js';
import authRouter from "./modules/auth/auth.controller.js"
import userRouter from "./modules/user/user.controller.js"
import charityRouter from "./modules/charity/charity.controller.js"
import dashboardRouter from "./modules/charity dashboard/dashboard.controller.js"
import donationRouter from "./modules/donation/donation.controller.js"
import evalutionRouter from "./modules/evaluation/evalution.controller.js"
import reportRouter from "./modules/report/report.controller.js"
import aiRouter from "./modules/ai/ai.controller.js"
import limiter from "./middleware/express.limit.middleware.js";
import helmet from "helmet";
import notificationRouter from "./modules/notfication/notfication.controller.js";

export const bootstrap = async (app, express) => {
  // ================= trust proxy ==================
  app.set("trust proxy", 1);

  // ================= npm helmet (security) ==================
  app.use(helmet());

  // ================= limit request =====================
  app.use(limiter);

  // ================= Test API (مهم جداً للـ Vercel) =================
  app.get("/", (req, res) => {
    res.json({ message: "API is running 🚀 By Eng. Sayed Herzallah" });
  });

  // ================= connect to database ===================
  connectDB().catch(err => console.error("Database Connection Error:", err));

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

  // ======================= import error handlers ============================
  app.all("*", notFoundHandler);

  // =============================== global error ====================
  app.use(globalErrorHandler);
}

// التصدير الافتراضي هنا مش لازم لو بتصدر الـ app من الـ index.js الرئيسي