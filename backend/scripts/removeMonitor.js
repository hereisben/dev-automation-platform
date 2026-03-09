import apiMonitorQueue from "../src/queue/apiMonitorQueue.js";

const schedulerId = "monitor:https://jsonplaceholder.typicode.com/posts/1";

async function remove() {
  await apiMonitorQueue.removeJobScheduler(schedulerId);
  console.log("scheduler remove:", schedulerId);
  process.exit();
}

remove();
