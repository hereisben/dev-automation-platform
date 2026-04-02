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

router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await screenshotQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        error: `screenshot job not found`,
      });
    }

    const state = await job.getState();

    if (state === "completed") {
      const result = job.returnvalue || {};

      return res.json({
        status: "completed",
        jobId: job.id,
        fileName: result.fileName ?? null,
        key: result.key ?? null,
        imageUrl: result.imageUrl ?? null,
      });
    }

    if (state === "failed") {
      return res.json({
        status: "failed",
        jobId: job.id,
        error: job.failedReason || "screenshot job failed",
      });
    }

    return res.json({
      status: state,
      jobId: job.id,
    });
  } catch (err) {
    console.error(`failed to get screenshot job:`, err);
    return res.status(500).json({
      error: `failed to fetch screenshot job status`,
    });
  }
});

export default router;
