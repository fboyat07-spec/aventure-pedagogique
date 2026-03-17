import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/active", (req, res) => {
  ok(res, { items: [] });
});

router.post("/complete", (req, res) => {
  ok(res, {});
});

export default router;
