import express from "express";
import apiMonitorQueue from "../queue/apiMonitorQueue.js";

function normalizeUrl(inputUrl) {
  const parsedUrl = new URL(inputUrl);
  parsedUrl.hostname = parsedUrl.hostname.toLowerCase();

  if (parsedUrl.pathname !== "/" && parsedUrl.pathname.endsWith("/")) {
    parsedUrl.pathname = parsedUrl.pathname.slice(0, -1);
  }

  return parsedUrl.toString();
}

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

  let normalizedUrl;

  try {
    normalizedUrl = normalizeUrl(url);
  } catch (error) {
    return res.status(400).json({ error: `invalid url` });
  }

  const schedulerId = `monitor:${normalizedUrl}`;

  try {
    const job = await apiMonitorQueue.upsertJobScheduler(
      schedulerId,
      { every: intervalSeconds * 1000 },
      {
        name: "check-api",
        data: { url: normalizedUrl },
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
      schedulerId,
      url: normalizedUrl,
      jobId: job.id,
    });
  } catch (error) {
    console.error(`failed to create api monitor:`, error.message);
    res.status(500).json({ error: `failed to create api monitor` });
  }
});

router.delete("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json(400).json({ error: `url is required` });
  }

  let normalizedUrl;

  try {
    normalizedUrl = normalizeUrl(url);
  } catch (error) {
    return res.json(400).json({ error: `invalid url` });
  }

  const schedulerId = `monitor:${normalizedUrl}`;

  try {
    await apiMonitorQueue.removeJobScheduler(schedulerId);
    console.log("scheduler removed:", schedulerId);
    return res.status(200).json({
      message: `API monitor removed`,
      schedulerId,
      url: normalizedUrl,
    });
  } catch (error) {
    console.error(
      `failed to remove api monitor ${schedulerId}:`,
      error.message,
    );

    return res.status(500).json({
      error: `failed to remove api monitor`,
    });
  }
});

export default router;
