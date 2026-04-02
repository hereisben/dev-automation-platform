import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { commitLimiter } from "../middleware/rateLimiters.js";
import generateCommitMessage from "../utils/generateCommitMessage.js";
const router = express.Router();

router.post("/generate", authMiddleware, commitLimiter, async (req, res) => {
  try {
    const { diff } = req.body;

    if (!diff || diff.trim() === "") {
      return res.status(400).json({
        error: `diff is required`,
      });
    }

    if (diff.length > 20000) {
      return res.status(400).json({
        error: `diff is too long`,
      });
    }

    const message = await generateCommitMessage(diff);

    return res.status(200).json({
      message,
    });
  } catch (err) {
    console.error(`commit generate error`, err);

    return res.status(500).json({
      error: `failed to generate commit message`,
    });
  }
});

export default router;
