import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();

router.get("/", (req, res) => {
  ok(res, { items: [] });
});

router.post("/", (req, res) => {
  ok(res, { child: null });
});

router.get("/:id", (req, res) => {
  ok(res, { child: null });
});

router.patch("/:id", (req, res) => {
  ok(res, { child: null });
});

export default router;
