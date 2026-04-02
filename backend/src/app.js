import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import apiMonitorRoute from "./routes/apiMonitorRoute.js";
import authRoute from "./routes/authRoute.js";
import commitRoute from "./routes/commitRoute.js";
import screenshotRoute from "./routes/screenshotRoute.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Dev Automation Platform is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/screenshot", screenshotRoute);
app.use("/api/monitors", apiMonitorRoute);
app.use("/api/commit", commitRoute);

export default app;
