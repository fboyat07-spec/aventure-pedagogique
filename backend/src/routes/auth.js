import express from "express";
import jwt from "jsonwebtoken";
import { ok } from "../utils/respond.js";
import { verifyIdToken } from "../services/firebaseAdmin.js";

const router = express.Router();
const DEV_JWT_SECRET = "dev-secret-key";
const DEV_JWT_EXPIRES_IN = "7d";
const DEV_JWT_PAYLOAD = { id: "dev-user", role: "admin" };
const IS_DEV_TOKEN_ENABLED = process.env.NODE_ENV !== "production";

router.post("/dev-token", (req, res) => {
  if (!IS_DEV_TOKEN_ENABLED) {
    console.warn(`[auth][dev-token] Dev token route is disabled in production (requestId=${req.id || "n/a"})`);
    return res.status(404).json({
      error: { code: "not_found", message: "Route not found" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  try {
    console.info(`[auth][dev-token] Generating development JWT (requestId=${req.id || "n/a"})`);
    const token = jwt.sign(DEV_JWT_PAYLOAD, DEV_JWT_SECRET, { expiresIn: DEV_JWT_EXPIRES_IN });
    console.info(
      `[auth][dev-token] Development JWT generated (requestId=${req.id || "n/a"}, userId=${DEV_JWT_PAYLOAD.id}, role=${DEV_JWT_PAYLOAD.role})`
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.error(`[auth][dev-token] Failed to generate development JWT (requestId=${req.id || "n/a"})`, err);
    return res.status(500).json({
      error: { code: "token_generation_failed", message: "Could not generate token" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

router.post("/session", async (req, res) => {
  const bypass = process.env.DEV_BYPASS_AUTH === "true";
  if (bypass) {
    return ok(res, { token: "dev-token", expiresIn: 3600, user: { id: "dev", role: "parent" } });
  }

  const { firebaseToken } = req.body || {};
  if (!firebaseToken) {
    return res.status(400).json({
      error: { code: "validation_failed", message: "firebaseToken required" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const decoded = await verifyIdToken(firebaseToken);
    if (!decoded) {
      return res.status(503).json({
        error: { code: "auth_unavailable", message: "Auth service unavailable" },
        requestId: req.id,
        timestamp: new Date().toISOString()
      });
    }
    return ok(res, { token: firebaseToken, expiresIn: 3600, user: { id: decoded.uid, role: decoded.role || "parent" } });
  } catch (err) {
    return res.status(401).json({
      error: { code: "unauthorized", message: "Invalid token" },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
