import cors from "cors";
import express from "express";
import screenshotRoutes from "./routes/screenshotRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Dev Automation Platform is running" });
});

app.use("/api/screenshot", screenshotRoutes);

export default app;
