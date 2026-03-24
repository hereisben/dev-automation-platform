import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("connect", () => {
  console.log(`PostgreSQL pool connected`);
});

pool.on("error", (err) => {
  console.error(`PostgreSQL pool error:`, err);
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("Connected to PostgreSQL database:", process.env.DATABASE_URL);
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err.message);
  });

export default pool;
