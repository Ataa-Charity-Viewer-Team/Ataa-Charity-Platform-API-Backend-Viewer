import express from "express";
import { bootstrap } from "./src/app.controller.js";
const app = express();
app.use(express.json()); 
  // ================= Test API (مهم جداً للـ Vercel) =================
  app.get("/", (req, res) => {
    res.json({ message: "API is running 🚀 By Eng. Sayed Herzallah" });
  });

bootstrap(app, express);

export default app;