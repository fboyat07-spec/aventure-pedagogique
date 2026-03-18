const KEY = "kidai_offline_queue_v1";
let memoryQueue = [];

function canUseLocalStorage() {
  return typeof globalThis !== "undefined" && typeof globalThis.localStorage !== "undefined";
}

function readQueue() {
  if (canUseLocalStorage()) {
    try {
      const raw = globalThis.localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      // ignore and fallback to memory
    }
  }
  return memoryQueue;
}

function writeQueue(queue) {
  const safeQueue = Array.isArray(queue) ? queue : [];
  memoryQueue = safeQueue;
  if (canUseLocalStorage()) {
    try {
      globalThis.localStorage.setItem(KEY, JSON.stringify(safeQueue));
    } catch (err) {
      // ignore quota errors
    }
  }
}

export function enqueueOfflineEvent(event) {
  const queue = readQueue();
  const item = {
    type: String(event?.type || "unknown"),
    childId: event?.childId || null,
    metadata: event?.metadata && typeof event.metadata === "object" ? event.metadata : {},
    createdAt: new Date().toISOString()
  };
  queue.push(item);
  writeQueue(queue.slice(-500));
  return item;
}

export function getOfflineQueue() {
  return readQueue();
}

export function clearOfflineQueue() {
  writeQueue([]);
}
