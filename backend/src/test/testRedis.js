import redis from "../queue/redis.js";

async function testRedis() {
  await redis.set("test:key", "hello redis");
  const value = await redis.get("test:key");
  console.log("Value:", value);
  process.exit();
}

testRedis();
