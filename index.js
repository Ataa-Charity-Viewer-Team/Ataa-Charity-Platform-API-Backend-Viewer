import express from "express";
import { bootstrap } from "./src/app.controller.js";
const app = express();
app.use(express.json()); 

bootstrap(app, express);

export default app;