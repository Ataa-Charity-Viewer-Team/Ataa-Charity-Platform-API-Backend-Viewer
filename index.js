import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

await bootstrap(app, express);

export default app;

// import express from "express";
// import { bootstrap } from "./src/app.controller.js";

// const app = express();

// await bootstrap(app, express);
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

// export default app;