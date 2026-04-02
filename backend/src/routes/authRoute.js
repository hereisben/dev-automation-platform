import bcrypt from "bcrypt";
import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [req.user.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `user not found`,
      });
    }

    return res.status(200).json({
      user: result.rows[0],
    });
  } catch (err) {
    console.error(`get current user error:`, err || err.message);
    return res.status(500).json({
      error: `failed to fetch current user`,
    });
  }
});

router.post("/register", authLimiter, async (req, res) => {
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

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: `email and password are required`,
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, password_hash FROM users WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: `invalid email or password`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        error: `invalid email or password`,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: `login successfully`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(`login error`, err || err.message);
    return res.status(500).json({
      error: `failed to login`,
    });
  }
});

export default router;
