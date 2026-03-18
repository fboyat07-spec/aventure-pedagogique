const eventsByUser = new Map();

function ensureUserBucket(userId) {
  if (!eventsByUser.has(userId)) {
    eventsByUser.set(userId, []);
  }
  return eventsByUser.get(userId);
}

export function recordEvent(userId, event = {}) {
  const bucket = ensureUserBucket(userId);
  const item = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: String(event.type || "unknown"),
    childId: event.childId || null,
    metadata: event.metadata && typeof event.metadata === "object" ? event.metadata : {},
    createdAt: new Date().toISOString()
  };
  bucket.push(item);

  if (bucket.length > 5000) {
    bucket.splice(0, bucket.length - 5000);
  }

  return item;
}

export function ingestEvents(userId, events = []) {
  if (!Array.isArray(events)) return [];
  return events.map((event) => recordEvent(userId, event));
}

export function listEvents(userId, days = 7) {
  const bucket = ensureUserBucket(userId);
  const from = Date.now() - Math.max(1, Number(days || 7)) * 24 * 60 * 60 * 1000;
  return bucket.filter((event) => new Date(event.createdAt).getTime() >= from);
}

function computeStreakDays(events) {
  const dayKeys = new Set(
    events.map((event) => {
      const date = new Date(event.createdAt);
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
        .toISOString()
        .slice(0, 10);
    })
  );

  let streak = 0;
  for (let i = 0; i < 60; i += 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
      .toISOString()
      .slice(0, 10);
    if (dayKeys.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export function summarizeEvents(userId, days = 7) {
  const events = listEvents(userId, days);
  const countByType = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  const lessonCompletions = countByType.lesson_completed || 0;
  const quizzes = countByType.exercise_submitted || 0;
  const quizCorrect = events.filter((event) => event.type === "exercise_submitted" && event.metadata?.isCorrect)
    .length;
  const quizSuccessRate = quizzes ? Math.round((quizCorrect / quizzes) * 100) : 0;
  const mistakeReviews = countByType.mistake_reviewed || 0;
  const sessions = countByType.session_start || 0;
  const avgSessionMinutes = Number(
    (
      events
        .filter((event) => event.type === "session_end")
        .map((event) => Number(event.metadata?.durationMin || 0))
        .reduce((sum, value) => sum + value, 0) /
      Math.max(countByType.session_end || 1, 1)
    ).toFixed(1)
  );

  const notificationsSent = countByType.notification_sent || 0;
  const notificationsOpened = countByType.notification_opened || 0;
  const notificationResponseRate = notificationsSent
    ? Math.round((notificationsOpened / notificationsSent) * 100)
    : 0;

  const lastEvent = events.length ? new Date(events[events.length - 1].createdAt).getTime() : 0;
  const hoursSinceLastEvent = lastEvent ? Math.round((Date.now() - lastEvent) / (1000 * 60 * 60)) : 999;

  const dropRisk = hoursSinceLastEvent > 48 ? "high" : hoursSinceLastEvent > 24 ? "medium" : "low";

  return {
    days: Math.max(1, Number(days || 7)),
    totalEvents: events.length,
    sessions,
    lessonCompletions,
    quizSuccessRate,
    mistakeReviews,
    avgSessionMinutes,
    streakDays: computeStreakDays(events),
    notificationResponseRate,
    dropRisk,
    hoursSinceLastEvent,
    countByType
  };
}
