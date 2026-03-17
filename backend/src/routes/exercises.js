import express from "express";
import { ok } from "../utils/respond.js";
import { generateExercise } from "../services/openai.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { skillId, difficulty } = req.body || {};
  const exercise = await generateExercise({ skillId: skillId || "math.addition.1", difficulty });
  ok(res, { items: [exercise] });
});

router.post("/submit", (req, res) => {
  ok(res, { isCorrect: false, correctAnswer: null, xpAwarded: 0 });
});

export default router;
