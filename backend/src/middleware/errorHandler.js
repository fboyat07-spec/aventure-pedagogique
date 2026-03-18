import { trackError } from "../services/monitoringStore.js";

export function notFound(req, res, next) {
  res.status(404).json({
    error: { code: "not_found", message: "Route not found" },
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  trackError({
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    message: err?.message || "Unexpected error",
    stack: err?.stack
  });
  res.status(500).json({
    error: { code: "server_error", message: "Unexpected error" },
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
}
