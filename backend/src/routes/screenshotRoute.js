import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { screenshotLimiter } from "../middleware/rateLimiters.js";
import screenshotQueue from "../queue/screenshotQueue.js";

const router = express.Router();

router.post("/", authMiddleware, screenshotLimiter, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim() === "") {
      return res.status(400).json({ error: "url is required" });
    }

    const jobs = await screenshotQueue.getJobs([
      "waiting",
      "active",
      "delayed",
    ]);

    const userJobsInProgress = jobs.filter(
      (job) => job.data.userId === req.user.userId,
    );

    if (userJobsInProgress.length >= 2) {
      return res.status(429).json({
        error: `You already have too many screenshot jobs in progress.`,
      });
    }

    const duplicateJob = userJobsInProgress.find((job) => job.data.url === url);

    if (duplicateJob) {
      return res.status(409).json({
        error: `A screenshot job for this URL is already in progress.`,
      });
    }

    const job = await screenshotQueue.add(
      "capture",
      { url, userId: req.user.userId },
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

router.get("/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await screenshotQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        error: `screenshot job not found`,
      });
    }

    if (job.data.userId !== req.user.userId) {
      return res.status(403).json({
        error: `You do not have access to this screenshot job.`,
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
