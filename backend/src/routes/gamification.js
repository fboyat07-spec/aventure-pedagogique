import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/status", (req, res) => {
  ok(res, { profile: null, recentRewards: [] });
});

router.post("/reward", (req, res) => {
  ok(res, {});
});

export default router;
