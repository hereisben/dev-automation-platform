import cors from "cors";
import express from "express";
import apiMonitorRoute from "./routes/apiMonitorRoute.js";
import authRoute from "./routes/authRoute.js";
import screenshotRoute from "./routes/screenshotRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Dev Automation Platform is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/screenshot", screenshotRoute);
app.use("/api/monitors", apiMonitorRoute);

export default app;
