import express from "express";
import serverless from "serverless-http";
import { bootstrap } from "./src/app.controller.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

await bootstrap(app, express);

export default serverless(app);