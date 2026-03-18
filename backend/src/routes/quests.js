import express from "express";
import { ok } from "../utils/respond.js";
import { generateQuest } from "../ai/narrativeEngine.js";

const router = express.Router();
const questProgress = new Map();

router.get("/active", (req, res) => {
  const skillId = req.query.skillId || "math.addition.1";
  const difficulty = Number(req.query.difficulty || 1);
  const quest = generateQuest(skillId, difficulty);
  const userProgress = questProgress.get(req.user.id) || {};

  ok(res, {
    items: [
      {
        id: `${skillId}:${difficulty}`,
        ...quest,
        completed: Boolean(userProgress[skillId])
      }
    ]
  });
});

router.post("/complete", (req, res) => {
  const { skillId = "math.addition.1", score = 1 } = req.body || {};
  const existing = questProgress.get(req.user.id) || {};
  existing[skillId] = {
    completedAt: new Date().toISOString(),
    score: Number(score)
  };
  questProgress.set(req.user.id, existing);
  ok(res, { completed: true, skillId });
});

export default router;
