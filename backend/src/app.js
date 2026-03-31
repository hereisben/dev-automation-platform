import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiMonitorRoute from "./routes/apiMonitorRoute.js";
import authRoute from "./routes/authRoute.js";
import commitRoute from "./routes/commitRoute.js";
import screenshotRoute from "./routes/screenshotRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Dev Automation Platform is running" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/screenshots", express.static(path.join(__dirname, "../screenshots")));

app.use("/api/auth", authRoute);
app.use("/api/screenshot", screenshotRoute);
app.use("/api/monitors", apiMonitorRoute);
app.use("/api/commit", commitRoute);

export default app;
