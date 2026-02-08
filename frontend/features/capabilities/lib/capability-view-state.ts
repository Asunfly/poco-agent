const LAST_VIEW_STORAGE_KEY = "poco.capabilities.last_view";
const PENDING_VIEW_STORAGE_KEY = "poco.capabilities.pending_view";

function getStorage(storage: "local" | "session"): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return storage === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function setLastCapabilityView(viewId: string) {
  const storage = getStorage("local");
  if (!storage) return;

  storage.setItem(LAST_VIEW_STORAGE_KEY, viewId);
}

export function getLastCapabilityView(): string | null {
  const storage = getStorage("local");
  if (!storage) return null;

  return storage.getItem(LAST_VIEW_STORAGE_KEY);
}

export function setPendingCapabilityView(viewId: string) {
  const storage = getStorage("session");
  if (!storage) return;

  storage.setItem(PENDING_VIEW_STORAGE_KEY, viewId);
}

export function consumePendingCapabilityView(): string | null {
  const storage = getStorage("session");
  if (!storage) return null;

  const value = storage.getItem(PENDING_VIEW_STORAGE_KEY);
  if (value) {
    storage.removeItem(PENDING_VIEW_STORAGE_KEY);
  }
  return value;
}
