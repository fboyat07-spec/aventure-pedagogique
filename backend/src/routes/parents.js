import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/summary", (req, res) => {
  ok(res, { report: null });
});

router.get("/recommendations", (req, res) => {
  ok(res, { items: [] });
});

export default router;
