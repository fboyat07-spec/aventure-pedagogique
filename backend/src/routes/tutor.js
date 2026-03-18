import express from "express";
import { ok } from "../utils/respond.js";
import { generateTutorReply, isOpenAIReady } from "../services/openai.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: { code: "validation_failed", message: "message is required" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  const result = await generateTutorReply({ message });
  ok(res, result);
});

router.post("/intervention", (req, res) => {
  ok(res, { shouldNudge: false, nudgeType: "", message: "" });
});

router.get("/status", (req, res) => {
  ok(res, { llmReady: isOpenAIReady() });
});

export default router;
