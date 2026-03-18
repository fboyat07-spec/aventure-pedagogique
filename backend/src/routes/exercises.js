import express from "express";
import crypto from "node:crypto";
import { ok } from "../utils/respond.js";
import { generateExercise } from "../services/openai.js";
import { createRateLimiter } from "../middleware/security.js";
import { db, isFirebaseReady } from "../services/firebaseAdmin.js";

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

function memoryCleanupExpiredExercises() {
  const now = Date.now();
  for (const [id, item] of pendingExercises.entries()) {
    if (now >= item.expiresAtMs) {
      pendingExercises.delete(id);
    }
  }
}

function pendingCollection() {
  return db.collection("pendingExercises");
}

async function savePendingExercise(item) {
  if (isFirebaseReady() && db) {
    try {
      await pendingCollection().doc(item.id).set(item, { merge: true });
      return;
    } catch (err) {
      console.warn("Pending exercise firestore fallback:", err.message);
    }
  }

  pendingExercises.set(item.id, item);
}

async function readPendingExercise(exerciseId) {
  if (isFirebaseReady() && db) {
    try {
      const snap = await pendingCollection().doc(exerciseId).get();
      if (!snap.exists) return null;
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn("Pending exercise read fallback:", err.message);
    }
  }

  memoryCleanupExpiredExercises();
  return pendingExercises.get(exerciseId) || null;
}

async function deletePendingExercise(exerciseId) {
  if (isFirebaseReady() && db) {
    try {
      await pendingCollection().doc(exerciseId).delete();
      return;
    } catch (err) {
      console.warn("Pending exercise delete fallback:", err.message);
    }
  }

  pendingExercises.delete(exerciseId);
}

router.post("/generate", async (req, res) => {
  memoryCleanupExpiredExercises();

  const { skillId, difficulty } = req.body || {};
  const generated = await generateExercise({ skillId: skillId || "math.addition.1", difficulty });
  const exerciseId = generated.id || crypto.randomUUID();
  const now = Date.now();

  await savePendingExercise({
    id: exerciseId,
    userId: req.user.id,
    answer: normalizeAnswer(generated.answer),
    createdAtMs: now,
    expiresAtMs: now + EXERCISE_TTL_MS
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

router.post("/submit", async (req, res) => {
  memoryCleanupExpiredExercises();

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

  const exercise = await readPendingExercise(exerciseId);
  if (!exercise || exercise.userId !== req.user.id) {
    return res.status(404).json({
      error: { code: "not_found", message: "Exercise expired or not found. Generate a new one." },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  if (Date.now() >= Number(exercise.expiresAtMs || 0)) {
    await deletePendingExercise(exerciseId);
    return res.status(404).json({
      error: { code: "not_found", message: "Exercise expired or not found. Generate a new one." },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  const isCorrect = normalizeAnswer(answer) === exercise.answer;
  if (isCorrect) {
    await deletePendingExercise(exerciseId);
  }

  return ok(res, {
    isCorrect,
    correctAnswer: isCorrect ? null : exercise.answer,
    xpAwarded: isCorrect ? 10 : 0
  });
});

export default router;
