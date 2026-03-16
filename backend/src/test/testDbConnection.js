import pool from "../config/db.js";

async function testDbConnection() {
  try {
    const result = await pool.query(`SELECT NOW()`);
    console.log(`Database connected successfully`);
    console.log(result.rows);
    console.log(`Server time:`, result.rows[0].now);
  } catch (err) {
    console.error(`Database connection failed:`, err.message);
  } finally {
    await pool.end();
  }
}

testDbConnection();
