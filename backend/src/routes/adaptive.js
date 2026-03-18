import express from "express";
import { ok } from "../utils/respond.js";
import { adjustDifficulty } from "../ai/adaptiveDifficulty.js";

const router = express.Router();

router.post("/adjust", (req, res) => {
  const input = req.body || {};
  const result = adjustDifficulty({
    successRate: Number(input.successRate ?? 0.5),
    currentLevel: Number(input.currentLevel ?? 1),
    errorStreak: Number(input.errorStreak ?? 0),
    responseMs: Number(input.responseMs ?? 0),
    minLevel: Number(input.minLevel ?? 1),
    maxLevel: Number(input.maxLevel ?? 5)
  });

  ok(res, { targetDifficulty: result.nextLevel, reason: result.reason, details: result });
});

export default router;
