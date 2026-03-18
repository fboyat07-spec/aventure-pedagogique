import Constants from "expo-constants";

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
  }).catch(() => null);
}
