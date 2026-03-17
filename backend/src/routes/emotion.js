import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.post("/detect", (req, res) => {
  ok(res, { frustrationScore: 0, engagementScore: 0, recommendedAction: "" });
});

export default router;
