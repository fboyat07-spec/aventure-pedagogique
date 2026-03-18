import express from "express";
import crypto from "node:crypto";
import { ok } from "../utils/respond.js";
import { generateExercise } from "../services/openai.js";
import { createRateLimiter } from "../middleware/security.js";

const router = express.Router();
router.use(createRateLimiter({ windowMs: 60 * 1000, max: 80 }));
const pendingExercises = new Map();
const EXERCISE_TTL_MS = 30 * 60 * 1000;

function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function cleanupExpiredExercises() {
  const now = Date.now();
  for (const [id, item] of pendingExercises.entries()) {
    if (now - item.createdAt > EXERCISE_TTL_MS) {
      pendingExercises.delete(id);
    }
  }
}

router.post("/generate", async (req, res) => {
  cleanupExpiredExercises();

  const { skillId, difficulty } = req.body || {};
  const generated = await generateExercise({ skillId: skillId || "math.addition.1", difficulty });
  const exerciseId = generated.id || crypto.randomUUID();

  pendingExercises.set(exerciseId, {
    answer: normalizeAnswer(generated.answer),
    createdAt: Date.now()
  });

  ok(res, {
    items: [
      {
        id: exerciseId,
        skillId: generated.skillId,
        difficulty: generated.difficulty,
        prompt: generated.prompt,
        choices: generated.choices,
        meta: generated.meta
      }
    ]
  });
});

router.post("/submit", (req, res) => {
  cleanupExpiredExercises();

  const { exerciseId, answer } = req.body || {};
  if (!exerciseId) {
    return res.status(400).json({
      error: { code: "validation_failed", message: "exerciseId required" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  if (answer === undefined || answer === null || String(answer).trim() === "") {
    return res.status(400).json({
      error: { code: "validation_failed", message: "answer required" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  const exercise = pendingExercises.get(exerciseId);
  if (!exercise) {
    return res.status(404).json({
      error: { code: "not_found", message: "Exercise expired or not found. Generate a new one." },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  const isCorrect = normalizeAnswer(answer) === exercise.answer;
  if (isCorrect) {
    pendingExercises.delete(exerciseId);
  }

  return ok(res, {
    isCorrect,
    correctAnswer: isCorrect ? null : exercise.answer,
    xpAwarded: isCorrect ? 10 : 0
  });
});

export default router;
