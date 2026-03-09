import express from "express";
import screenshotQueue from "../queue/screenshotQueue.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    const job = await screenshotQueue.add(
      "capture",
      { url },
      { attempts: 3, backoff: 5000 },
    );

    return res.status(202).json({
      status: "queued",
      message: "screenshot job added successfully",
      jobId: job.id,
    });
  } catch (error) {
    console.error("failed to add screenshot job:", error);
    return res.status(500).json({
      error: "failed to queue screenshot job",
    });
  }
});

export default router;
