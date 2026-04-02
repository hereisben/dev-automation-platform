import dotenv from "dotenv";
dotenv.config();

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Worker } from "bullmq";
import puppeteer from "puppeteer";
import bullmqConnection from "../config/bullmqConnection.js";
import s3 from "../config/s3.js";

const screenshotWorker = new Worker(
  "screenshotQueue",
  async (job) => {
    const { url } = job.data;

    console.log(`processing screenshot job for: ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.setViewport({
        width: 1440,
        height: 900,
      });

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const fileName = `screenshot-${job.id}.png`;
      const key = `screenshots/${fileName}`;

      const screenshotBuffer = await page.screenshot({
        type: "png",
        fullPage: true,
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
          Body: screenshotBuffer,
          ContentType: "image/png",
        }),
      );

      const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      console.log(`screenshot uploaded to S3: ${imageUrl}`);

      return {
        success: true,
        fileName,
        key,
        imageUrl,
      };
    } catch (error) {
      console.error(`screenshot job ${job.id} failed:`, error.message);
      throw error;
    } finally {
      await browser.close();
    }
  },
  { connection: bullmqConnection },
);

screenshotWorker.on("completed", (job) => {
  console.log(`job ${job.id} completed`);
});

screenshotWorker.on("failed", (job, error) => {
  console.error(`job ${job?.id} failed:`, error.message);
});

console.log(`screenshot worker is running`);
