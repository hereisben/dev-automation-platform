import { Queue } from "bullmq";
import redis from "../config/redis.js";

const screenshotQueue = new Queue("screenshotQueue", {
  connection: redis,
});

export default screenshotQueue;
