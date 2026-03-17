import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.post("/start", (req, res) => {
  ok(res, { session: null, question: null, remaining: 0 });
});

router.post("/answer", (req, res) => {
  ok(res, { isCorrect: false, nextQuestion: null, done: false, progress: 0 });
});

router.post("/finish", (req, res) => {
  ok(res, { session: null, placement: null });
});

export default router;
