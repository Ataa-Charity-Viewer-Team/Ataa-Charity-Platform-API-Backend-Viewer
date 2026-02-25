import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
  //================ read data bady ===============
  app.use(express.json())
  // ================ problem solving front end (cors) ==========================
  app.use(cors())

app.get("/", (req, res) => {
    res.json({ 
        message: "API is running 🚀", 
        developer: "Eng. Sayed Herzallah",
        status: "Online"
    });
});

bootstrap(app, express).catch(err => {
    console.error("Bootstrap Error:", err);
});

export default app;