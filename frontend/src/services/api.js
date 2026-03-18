import Constants from "expo-constants";
import { enqueueOfflineEvent } from "./offlineQueue";

const DEFAULT_TIMEOUT_MS = 8000;

function resolveHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) return "localhost";

  const cleaned = hostUri
    .replace(/^exp:\/\//, "")
    .replace(/^http:\/\//, "")
    .replace(/^https:\/\//, "");

  const hostPort = cleaned.split("/")[0];
  if (!hostPort) return "localhost";

  if (hostPort.startsWith("[") && hostPort.includes("]")) {
    return hostPort.slice(1, hostPort.indexOf("]"));
  }

  return hostPort.split(":")[0];
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || `http://${resolveHost()}:3000/v1`;

export async function apiRequest(path, options = {}) {
  const { token, headers, timeoutMs, ...rest } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {})
      },
      signal: controller.signal,
      ...rest
    });

    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const message = data?.error?.message || text || "Request failed";
      throw new Error(message);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export function trackEvent({ token, type, childId, metadata }) {
  if (!type) return Promise.resolve(null);
  return apiRequest("/events", {
    method: "POST",
    token,
    body: JSON.stringify({ type, childId, metadata })
  }).catch(() => {
    enqueueOfflineEvent({ type, childId, metadata });
    return null;
  });
}

export function syncOfflinePayload({ token, payload }) {
  return apiRequest("/sync/upload", {
    method: "POST",
    token,
    body: JSON.stringify(payload || {})
  });
}

export function fetchNextNudge({ token }) {
  return apiRequest("/notifications/next-nudge", { token });
}

export function fetchNotificationPreferences({ token }) {
  return apiRequest("/notifications/preferences", { token });
}

export function updateNotificationPreferences({ token, updates }) {
  return apiRequest("/notifications/preferences", {
    method: "PATCH",
    token,
    body: JSON.stringify(updates || {})
  });
}

export function registerPushDevice({ token, deviceToken, platform = "web" }) {
  return apiRequest("/notifications/devices/register", {
    method: "POST",
    token,
    body: JSON.stringify({ token: deviceToken, platform })
  });
}

export function listPushDevices({ token }) {
  return apiRequest("/notifications/devices", { token });
}

export function sendTestPush({ token }) {
  return apiRequest("/notifications/send-test", {
    method: "POST",
    token
  });
}

export function sendSmartNudgePush({ token, childName }) {
  return apiRequest("/notifications/send-nudge", {
    method: "POST",
    token,
    body: JSON.stringify({ childName })
  });
}

export function scanHomework({ token, imageUrl, instruction }) {
  return apiRequest("/homework/scan", {
    method: "POST",
    token,
    body: JSON.stringify({ imageUrl, instruction })
  });
}

export function fetchOpsStatus({ token }) {
  return apiRequest("/ops/status", { token });
}

export function fetchOpsMetrics({ token, minutes = 60 }) {
  return apiRequest(`/ops/metrics?minutes=${minutes}`, { token });
}

export function reportClientError({ token, message, stack, context }) {
  return apiRequest("/ops/client-error", {
    method: "POST",
    token,
    body: JSON.stringify({ message, stack, context })
  }).catch(() => null);
}
