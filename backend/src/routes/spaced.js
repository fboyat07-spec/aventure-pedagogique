import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/next", (req, res) => {
  ok(res, { items: [] });
});

router.post("/schedule", (req, res) => {
  ok(res, { review: null });
});

export default router;
