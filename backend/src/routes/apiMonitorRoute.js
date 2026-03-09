import express from "express";
import apiMonitorQueue from "../queue/apiMonitorQueue.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, intervalSeconds } = req.body;

  if (!url) {
    return res.status(400).json({ error: `url is required` });
  }

  if (!intervalSeconds || intervalSeconds < 10) {
    return res
      .status(400)
      .json({ error: `intervalSeconds must be at least 10` });
  }

  try {
    const job = await apiMonitorQueue.upsertJobScheduler(
      `monitor:${url}`,
      { every: intervalSeconds * 1000 },
      {
        name: "check-api",
        data: { url },
        opts: {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 5000,
          },
          removeOnComplete: 20,
          removeOnFail: 50,
        },
      },
    );

    res.status(201).json({
      message: "API monitor created",
      schedulerId: `monitor:${url}`,
      jobId: job.id,
    });
  } catch (error) {
    console.error(`failed to create api monitor:`, error.message);
    res.status(500).json({ error: `failed to create api monitor` });
  }
});

export default router;
