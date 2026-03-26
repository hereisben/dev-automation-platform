import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export async function connectRedis() {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Failed to connect Redis:", err.message);
    throw err;
  }
}

export default redis;
