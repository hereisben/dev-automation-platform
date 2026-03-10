import axios from "axios";
import { Worker } from "bullmq";
import redis from "../queue/redis.js";
import generateIncidentSummary from "../utils/generateIncidentSummary.js";

const apiMonitorWorker = new Worker(
  "apiMonitorQueue",
  async (job) => {
    const { url } = job.data;

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

      const incidentSummary =
        incident === null
          ? null
          : generateIncidentSummary({
              url,
              statusCode,
              responseTime,
              incident,
            });

      const result = {
        success: response.status >= 200 && response.status < 400,
        url,
        statusCode: response.status,
        responseTime,
        checkedAt: new Date().toISOString(),
        bodyPreview:
          typeof response.data === "string"
            ? response.data.slice(0, 300)
            : JSON.stringify(response.data).slice(0, 300),
        incident,
        incidentSummary,
      };

      console.log(`api monitor success:`, result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - start;

      const incident = {
        type: "request_error",
        severity: "high",
        message: error.message,
      };

      const incidentSummary = generateIncidentSummary({
        url,
        statusCode: null,
        responseTime,
        incident,
      });

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

      console.error(`api monitor failed:`, result);
      return result;
    }
  },
  { connection: redis },
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
