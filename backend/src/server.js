import dotenv from "dotenv";
import app from "./app.js";
import { testDbConnection } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  await testDbConnection();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
} catch (err) {
  console.error("Server startup failed:", err.message);
  process.exit(1);
}
