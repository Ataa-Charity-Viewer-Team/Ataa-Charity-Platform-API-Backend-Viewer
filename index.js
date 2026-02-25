import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { bootstrap } from "./src/app.controller.js"

const app = express()
const port = process.env.PORT || 8000

const startServer = async () => {
  await bootstrap(app, express)
  app.listen(port, () => console.log("server is running on port"))
}

startServer()

export default app