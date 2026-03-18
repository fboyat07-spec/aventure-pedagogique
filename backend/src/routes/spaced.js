import express from "express";
import { ok } from "../utils/respond.js";
import { spacedReview } from "../ai/spacedRepetition.js";

const router = express.Router();
const plans = new Map();

router.get("/next", (req, res) => {
  const userPlan = plans.get(req.user.id) || [];
  ok(res, { items: userPlan.slice(0, 5) });
});

router.post("/schedule", (req, res) => {
  const payload = req.body || {};
  const review = spacedReview({
    stabilityLevel: Number(payload.stabilityLevel ?? 0),
    lastReviewAt: payload.lastReviewAt || Date.now(),
    isCorrect: Boolean(payload.isCorrect)
  });

  const item = {
    id: `review_${Date.now()}`,
    skillId: payload.skillId || "math.addition.1",
    ...review
  };

  const existing = plans.get(req.user.id) || [];
  plans.set(req.user.id, [item, ...existing].slice(0, 30));

  ok(res, { review: item });
});

export default router;
