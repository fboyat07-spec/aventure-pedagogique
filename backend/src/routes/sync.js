import express from "express";
import { ok } from "../utils/respond.js";
import { ingestEvents, summarizeEvents } from "../services/analyticsStore.js";

const router = express.Router();

router.post("/upload", (req, res) => {
  const { events = [], progress = [], exercises = [] } = req.body || {};

  const acceptedEvents = ingestEvents(
    req.user.id,
    Array.isArray(events) ? events.slice(0, 500) : []
  );

  ok(res, {
    synced: {
      events: acceptedEvents.length,
      progress: Array.isArray(progress) ? progress.length : 0,
      exercises: Array.isArray(exercises) ? exercises.length : 0
    },
    summary: summarizeEvents(req.user.id, 7)
  });
});

export default router;
