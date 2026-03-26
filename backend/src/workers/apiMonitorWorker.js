import axios from "axios";
import { Worker } from "bullmq";
import bullmqConnection from "../config/bullmqConnection.js";
import pool from "../config/db.js";
import generateAIIncidentSummary from "../utils/generateAIIncidentSummary.js";
import generateIncidentSummary from "../utils/generateIncidentSummary.js";

async function saveMonitorResult({ monitorId, result }) {
  const logResult = await pool.query(
    `INSERT INTO monitor_logs (
      monitor_id,
      status_code,
      response_time,
      body_preview,
      success,
      checked_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
    [
      monitorId,
      result.statusCode,
      result.responseTime,
      result.bodyPreview,
      result.success,
      result.checkedAt,
    ],
  );

  const monitorLogId = logResult.rows[0].id;

  if (result.incident) {
    await pool.query(
      `INSERT INTO incidents (
        monitor_id,
        monitor_log_id,
        type,
        severity,
        message,
        summary
      )
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        monitorId,
        monitorLogId,
        result.incident.type,
        result.incident.severity,
        result.incident.message,
        result.incidentSummary,
      ],
    );
  }
}

const apiMonitorWorker = new Worker(
  "apiMonitorQueue",
  async (job) => {
    const { url, monitorId } = job.data;

    const start = Date.now();

    try {
      const response = await axios({
        method: "get",
        url,
        timeout: 10000,
        validateStatus: () => true,
      });

      const responseTime = Date.now() - start;

      const statusCode = response.status;
      let incident = null;

      if (statusCode >= 500) {
        incident = {
          type: "server_error",
          severity: "high",
          message: `API returned status ${statusCode}`,
        };
      } else if (statusCode >= 400) {
        incident = {
          type: "client_error",
          severity: "medium",
          message: `API returned status ${statusCode}`,
        };
      } else if (responseTime > 3000) {
        incident = {
          type: "slow_response",
          severity: "medium",
          message: `API was slow: ${responseTime}ms`,
        };
      }

      const bodyPreview =
        typeof response.data === "string"
          ? response.data.slice(0, 300)
          : JSON.stringify(response.data).slice(0, 300);

      let incidentSummary = null;

      if (incident) {
        try {
          incidentSummary = await generateAIIncidentSummary({
            url,
            statusCode,
            responseTime,
            incident,
            bodyPreview,
          });
        } catch (aiError) {
          console.error(`ai incident summary failed:`, aiError.message);
          incidentSummary = await generateIncidentSummary({
            url,
            statusCode,
            responseTime,
            incident,
          });
        }
      }

      const result = {
        success: response.status >= 200 && response.status < 400,
        url,
        statusCode: response.status,
        responseTime,
        checkedAt: new Date().toISOString(),
        bodyPreview,
        incident,
        incidentSummary,
      };

      await saveMonitorResult({ monitorId, result });
      console.log(`api monitor success:`, result);
      return result;
    } catch (requestError) {
      const responseTime = Date.now() - start;

      const incident = {
        type: "request_error",
        severity: "high",
        message: requestError.message,
      };

      let incidentSummary = null;

      try {
        incidentSummary = await generateAIIncidentSummary({
          url,
          statusCode: null,
          responseTime,
          incident,
          bodyPreview: null,
        });
      } catch (aiError) {
        console.error(`ai incident summary failed:`, aiError.message);
        incidentSummary = await generateIncidentSummary({
          url,
          statusCode: null,
          responseTime,
          incident,
        });
      }

      const result = {
        success: false,
        url,
        statusCode: null,
        responseTime,
        checkedAt: new Date().toISOString(),
        bodyPreview: null,
        incident,
        incidentSummary,
      };

      await saveMonitorResult({ monitorId, result });
      console.error(`api monitor failed:`, result);
      return result;
    }
  },
  { connection: bullmqConnection },
);

apiMonitorWorker.on("completed", (job, result) => {
  console.log(`api monitor completed: ${job.id}`);
  console.log(result);
});

apiMonitorWorker.on("failed", (job, error) => {
  console.error(`api monitor failed: ${job?.id}`);
  console.error(error.message);
});

export default apiMonitorWorker;
