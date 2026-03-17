import { verifyIdToken } from "../services/firebaseAdmin.js";

export async function requireAuth(req, res, next) {
  const bypass = process.env.DEV_BYPASS_AUTH === "true";
  if (bypass) {
    req.user = { id: "dev", role: "parent" };
    return next();
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: { code: "unauthorized", message: "Missing token" },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  try {
    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return res.status(503).json({
        error: { code: "auth_unavailable", message: "Auth service unavailable" },
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    }
    req.user = { id: decoded.uid, role: decoded.role || "parent" };
    return next();
  } catch (err) {
    return res.status(401).json({
      error: { code: "unauthorized", message: "Invalid token" },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }
}
