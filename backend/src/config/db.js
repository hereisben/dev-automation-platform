import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("connect", () => {
  console.log(`PostgreSQL connected`);
});

pool.on("error", (err) => {
  console.error(`PostgreSQL pool error:`, err);
});

export default pool;
