import { Worker } from "bullmq";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import redis from "../queue/redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __screenshotDir = path.join(__dirname, "../../screenshots");

const screenshotWorker = new Worker(
  "screenshotQueue",
  async (job) => {
    const { url } = job.data;

    console.log(`processing screenshot job for: ${url}`);

    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();

      await page.setViewport({
        width: 1440,
        height: 900,
      });

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const fileName = `screenshot-${job.id}.png`;
      const filePath = path.join(__screenshotDir, fileName);

      await page.screenshot({ path: filePath, fullPage: true });

      console.log(`screenshot saved: ${filePath}`);

      return {
        success: true,
        fileName,
        filePath,
      };
    } catch (error) {
      console.error(`screenshot job ${job.id} failed:`, error.message);
      throw error;
    } finally {
      await browser.close();
    }
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
