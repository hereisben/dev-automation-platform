import { Queue } from "bullmq";
import redis from "./redis.js";

const apiMonitorQueue = new Queue("apiMonitorQueue", { connection: redis });

export default apiMonitorQueue;
