// ===================== import modules =====================
import connectDB from "./dataBase/Connect.js"
import { notFoundHandler } from "./Utils/Error-Handling/notFoundHandler.js"
import { globalErrorHandler } from './Utils/Error-Handling/globalHandler.js';
import cors from 'cors'
import authRouter from "../src/Modules/Auth/auth.controller.js"
import userRouter from "../src/Modules/User/user.controller.js"
import charityRouter from "../src/Modules/Charity/charity.controller.js"
import dashboardRouter from "../src/Modules/Charity Dashboard/dashboard.controller.js"
import donationRouter from "../src/Modules/Donation/donation.controller.js"
import evalutionRouter from "../src/Modules/Evaluation/evalution.controller.js"
import reportRouter from "../src/Modules/Report/report.controller.js"
import aiRouter from "../src/Modules/AI/ai.controller.js"
import limiter from "./Middleware/express.limit.middleware.js";
import helmet from "helmet";
import notificationRouter from "./Modules/Notfication/notfication.controller.js";
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