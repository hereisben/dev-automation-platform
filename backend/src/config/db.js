import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error(`PostgreSQL pool error:`, err);
});

export async function testDbConnection() {
  try {
    await pool.query(`SELECT 1`);
    console.log(`PostgreSQL connected`);
  } catch (err) {
    console.error(`PostgreSQL connection failed:`, err || err.message);
  }
}

export default pool;
