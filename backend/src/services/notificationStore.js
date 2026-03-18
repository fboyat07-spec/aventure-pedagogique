const prefsByUser = new Map();

function defaultPrefs() {
  return {
    enabled: true,
    quietHours: { start: "20:00", end: "07:00" },
    channels: { push: true, email: false, inApp: true },
    maxPerDay: 2,
    updatedAt: new Date().toISOString()
  };
}

export function getNotificationPrefs(userId) {
  if (!prefsByUser.has(userId)) {
    prefsByUser.set(userId, defaultPrefs());
  }
  return prefsByUser.get(userId);
}

export function updateNotificationPrefs(userId, updates = {}) {
  const current = getNotificationPrefs(userId);
  const next = {
    ...current,
    ...updates,
    channels: {
      ...current.channels,
      ...(updates.channels && typeof updates.channels === "object" ? updates.channels : {})
    },
    quietHours: {
      ...current.quietHours,
      ...(updates.quietHours && typeof updates.quietHours === "object" ? updates.quietHours : {})
    },
    updatedAt: new Date().toISOString()
  };

  prefsByUser.set(userId, next);
  return next;
}
