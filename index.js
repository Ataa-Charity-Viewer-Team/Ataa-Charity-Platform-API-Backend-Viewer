import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { bootstrap } from "./src/app.controller.js"

const app = express();

bootstrap(app, express)
  .then(() => {
    console.log("App Bootstrapped Successfully");
  })
  .catch(err => {
    console.error("Critical Bootstrap Error:", err.message);
  });

export default app;