import dotenv from "dotenv";
dotenv.config();

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function test() {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: "test/test-upload.txt",
        Body: "hello from test script",
        ContentType: "text/plain",
      }),
    );

    console.log("✅ S3 upload permission works");
  } catch (error) {
    console.error("❌ S3 upload failed");
    console.error(error);
  }
}

test();
