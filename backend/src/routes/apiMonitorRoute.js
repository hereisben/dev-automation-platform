import express from "express";
import pool from "../config/db.js";
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

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, url, normalized_url, interval_seconds, created_at
      FROM api_monitors
      ORDER BY created_at DESC
      `);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(`failed to fetch monitors:`, err.message);
    return res.status(500).json({ error: `failed to fetch monitors` });
  }
});

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
    const existingMonitorResult = await pool.query(
      `SELECT id FROM api_monitors WHERE normalized_url = $1`,
      [normalizedUrl],
    );

    let monitorId;

    if (existingMonitorResult.rows.length > 0) {
      monitorId = existingMonitorResult.rows[0].id;

      await pool.query(
        `UPDATE api_monitors SET interval_seconds = $1 WHERE id = $2`,
        [intervalSeconds, monitorId],
      );
    } else {
      const insertResult = await pool.query(
        `INSERT INTO api_monitors (url, normalized_url, interval_seconds) VALUES ($1, $2, $3) RETURNING id`,
        [url, normalizedUrl, intervalSeconds],
      );

      monitorId = insertResult.rows[0].id;
    }

    const job = await apiMonitorQueue.upsertJobScheduler(
      schedulerId,
      { every: intervalSeconds * 1000 },
      {
        name: "check-api",
        data: { monitorId, url: normalizedUrl },
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

    console.log("scheduler created:", schedulerId);
    res.status(201).json({
      message: "API monitor created",
      monitorId,
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
    return res.status(400).json({ error: `url is required` });
  }

  let normalizedUrl;

  try {
    normalizedUrl = normalizeUrl(url);
  } catch (error) {
    return res.status(400).json({ error: `invalid url` });
  }

  const schedulerId = `monitor:${normalizedUrl}`;

  try {
    const result = await pool.query(
      `SELECT id FROM api_monitors WHERE normalized_url = $1`,
      [normalizedUrl],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `monitor not found` });
    }

    const monitorId = result.rows[0].id;

    await apiMonitorQueue.removeJobScheduler(schedulerId);
    console.log("scheduler removed:", schedulerId);

    await pool.query(`DELETE FROM api_monitors WHERE id = $1`, [monitorId]);

    return res.status(200).json({
      message: `API monitor removed`,
      monitorId,
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
