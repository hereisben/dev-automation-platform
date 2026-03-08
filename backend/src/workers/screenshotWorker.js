import { Worker } from "bullmq";
import redis from "../queue/redis.js";

const screenshotWorker = new Worker(
  "screenshotQueue",
  async (job) => {
    const { url } = job.data;

    console.log(`processing screenshot job for: ${url}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`screenshot job completed for: ${url}`);

    return {
      success: true,
      url,
    };
  },
  { connection: redis },
);

screenshotWorker.on("completed", (job) => {
  console.log(`job ${job.id} completed`);
});

screenshotWorker.on("failed", (job, error) => {
  console.error(`job ${job?.id} failed:`, error.message);
});

console.log(`screenshot worker is running`);
