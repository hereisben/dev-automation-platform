import bcrypt from "bcrypt";
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    return res
      .status(400)
      .json({ error: `name, email, and password are required` });
  }

  try {
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: `email already exists`,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name, email, passwordHash],
    );

    return res.status(200).json({
      message: `user registered successfully`,
      user: result.rows[0],
    });
  } catch (err) {
    console.error(`register error:`, err || err.message);
    return res.status(500).json({
      error: `failed to register user`,
    });
  }
});

export default router;
