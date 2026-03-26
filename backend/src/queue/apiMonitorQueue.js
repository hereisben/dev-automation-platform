import { Queue } from "bullmq";
import bullmqConnection from "../config/bullmqConnection.js";

const apiMonitorQueue = new Queue("apiMonitorQueue", {
  connection: bullmqConnection,
});

export default apiMonitorQueue;
