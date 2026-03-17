import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/me", (req, res) => {
  ok(res, { user: null });
});

router.patch("/me", (req, res) => {
  ok(res, { user: null });
});

export default router;
