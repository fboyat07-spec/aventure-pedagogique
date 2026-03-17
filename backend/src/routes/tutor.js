import express from "express";
import { ok } from "../utils/respond.js";
import { generateTutorReply } from "../services/openai.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  const result = await generateTutorReply({ message: message || "" });
  ok(res, result);
});

router.post("/intervention", (req, res) => {
  ok(res, { shouldNudge: false, nudgeType: "", message: "" });
});

export default router;
