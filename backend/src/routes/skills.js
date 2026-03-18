import express from "express";
import { ok } from "../utils/respond.js";
import { db, isFirebaseReady } from "../services/firebaseAdmin.js";

const router = express.Router();

const sampleSkills = [
  { id: "math.addition.1", domain: "math", level: 1, title: "Addition Basics", tags: ["addition"] },
  { id: "math.subtraction.1", domain: "math", level: 1, title: "Subtraction Basics", tags: ["subtraction"] },
  { id: "reading.phonics.1", domain: "reading", level: 1, title: "Phonics Start", tags: ["phonics"] }
];

router.get("/", async (req, res) => {
  if (isFirebaseReady() && db) {
    try {
      const snapshot = await db.collection("skills").limit(50).get();
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return ok(res, { items });
    } catch (err) {
      console.warn("Skills Firestore fallback:", err.message);
    }
  }
  return ok(res, { items: sampleSkills });
});

router.get("/:id", async (req, res) => {
  if (isFirebaseReady() && db) {
    try {
      const doc = await db.collection("skills").doc(req.params.id).get();
      const item = doc.exists ? { id: doc.id, ...doc.data() } : null;
      return ok(res, { skill: item });
    } catch (err) {
      console.warn("Skill Firestore fallback:", err.message);
    }
  }
  const item = sampleSkills.find((s) => s.id === req.params.id) || null;
  return ok(res, { skill: item });
});

export default router;
