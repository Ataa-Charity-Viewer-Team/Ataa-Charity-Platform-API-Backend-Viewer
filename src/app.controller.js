// ===================== import modules =====================
import connectDB from "./dataBase/connect.js"
import { notFoundHandler } from "./utils/error-handling/notFoundHandler.js"
import { globalErrorHandler } from './utils/error-handling/globalHandler.js';
import cors from 'cors'
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
  // ================= npm helmpt (security) ==================
  app.use(helmet())
  //================ read data bady ===============
  app.use(express.json())
  // ================= limit request =====================
  app.use(limiter)
  // ================ problem solving front end (cors) ==========================
  app.use(cors())
  //================================== await connect to data base ===================
  await connectDB()
  // ================================== Testing ================================
  app.use("/test", (req, res) => res.send.json({ message: "hello world" }))
  // ============================ import controllers (endpoints) ============================
  app.use("/auth", authRouter)
  app.use("/users", userRouter)
  app.use("/donor", donationRouter)
  app.use("/charity", charityRouter)
  app.use("/dashboard", dashboardRouter)
  app.use("/rating", evalutionRouter)
  app.use("/report", reportRouter)
  app.use("/ai", aiRouter)
  app.use("/notification", notificationRouter)
  // ======================= import error handlers ============================
  app.all("/{*path}", notFoundHandler)
  //=============================== global error ====================
  app.use(globalErrorHandler)
}