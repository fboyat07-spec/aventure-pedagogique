import express from "express";
import { ok } from "../utils/respond.js";

const router = express.Router();
const profiles = new Map();

function levelFromXp(xp) {
  return Math.floor(Number(xp || 0) / 250) + 1;
}

function getProfile(userId) {
  if (!profiles.has(userId)) {
    profiles.set(userId, {
      xp: 0,
      level: 1,
      streak: 0,
      badges: []
    });
  }
  return profiles.get(userId);
}

router.get("/status", (req, res) => {
  const profile = getProfile(req.user.id);
  ok(res, { profile, recentRewards: [] });
});

router.post("/reward", (req, res) => {
  const { xp = 10, reason = "exercise" } = req.body || {};
  const profile = getProfile(req.user.id);
  profile.xp += Number(xp);
  profile.level = levelFromXp(profile.xp);
  profile.streak = Math.max(profile.streak, 1);

  if (profile.level >= 5 && !profile.badges.includes("Adventurer")) {
    profile.badges.push("Adventurer");
  }
  if (profile.level >= 10 && !profile.badges.includes("Scholar")) {
    profile.badges.push("Scholar");
  }

  ok(res, {
    profile,
    reward: {
      xp: Number(xp),
      reason,
      grantedAt: new Date().toISOString()
    }
  });
});

export default router;
