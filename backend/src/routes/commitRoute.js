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

    const looksLikeGitDiff =
      diff.includes("diff --git") ||
      diff.includes("---") ||
      diff.includes("+++") ||
      diff.includes("@@");

    if (!looksLikeGitDiff) {
      return res.status(400).json({
        error: "Please provide a real git diff",
      });
    }

    if (diff.length < 50) {
      return res.status(400).json({
        error: "Git diff is too short to generate a reliable commit message",
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
