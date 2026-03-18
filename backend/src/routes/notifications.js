import express from "express";
import { ok } from "../utils/respond.js";
import { getNotificationPrefs, updateNotificationPrefs } from "../services/notificationStore.js";
import { summarizeEvents } from "../services/analyticsStore.js";
import { getUserProfile } from "../services/profileStore.js";
import { buildSmartNudge } from "../services/nudgeEngine.js";

const router = express.Router();

router.get("/preferences", (req, res) => {
  const preferences = getNotificationPrefs(req.user.id);
  ok(res, { preferences });
});

router.patch("/preferences", (req, res) => {
  const preferences = updateNotificationPrefs(req.user.id, req.body || {});
  ok(res, { preferences });
});

router.get("/next-nudge", async (req, res) => {
  const preferences = getNotificationPrefs(req.user.id);
  if (!preferences.enabled) {
    return ok(res, { nudge: null, preferences });
  }

  const summary = summarizeEvents(req.user.id, Number(req.query.days || 7));
  const user = await getUserProfile(req.user.id);
  const nudge = buildSmartNudge({
    summary,
    weeklyGoal: user?.weeklyGoal || "",
    childName: req.query.childName || ""
  });

  ok(res, { nudge, preferences, summary });
});

export default router;
