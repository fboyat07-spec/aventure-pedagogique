import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.post("/adjust", (req, res) => {
  ok(res, { targetDifficulty: 0, reason: "" });
});

export default router;
