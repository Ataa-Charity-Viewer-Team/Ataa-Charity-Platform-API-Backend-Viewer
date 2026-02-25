// import express from "express";
// const app = express();
// app.use(express.json()); 
//   // ================= Test API (مهم جداً للـ Vercel) =================
//   app.get("/", (req, res) => {
  //     res.json({ message: "API is running 🚀 By Eng. Sayed Herzallah" });
  //   });

// bootstrap(app, express);
import serverless from "serverless-http";
import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
app.use(express.json());

// ================= Test API مهم جداً على Vercel =================
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀 By Eng. Sayed Herzallah" });
});

// ================= Bootstrapping باقي الـ routes =================
bootstrap(app, express);

// ================= تصدير الـ handler لـ Vercel =================
export const handler = serverless(app);