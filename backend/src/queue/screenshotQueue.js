import { Queue } from "bullmq";
import bullmqConnection from "../config/bullmqConnection.js";

const screenshotQueue = new Queue("screenshotQueue", {
  connection: bullmqConnection,
});

export default screenshotQueue;
