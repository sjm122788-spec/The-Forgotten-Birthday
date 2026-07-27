const STORAGE_KEY = "forgottenBirthday.save";
const SAVE_VERSION = 1;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to read saved game:", error);
    return null;
  }
}

function writeStorage(payload) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (error) {
    console.warn("Unable to save game:", error);
    return false;
  }
}

function removeStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn("Unable to clear saved game:", error);
    return false;
  }
}

export function hasSavedGame() {
  return loadGame() !== null;
}

export function loadGame() {
  const rawValue = readStorage();

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!isObject(parsed)) {
      return null;
    }

    if (parsed.version !== SAVE_VERSION) {
      return null;
    }

    const payload = {
      version: SAVE_VERSION,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
      screen: typeof parsed.screen === "string" ? parsed.screen : null,
      chapterId: typeof parsed.chapterId === "string" ? parsed.chapterId : null,
      cueIndex: typeof parsed.cueIndex === "number" ? parsed.cueIndex : 0,
      completedChapters: Array.isArray(parsed.completedChapters)
        ? parsed.completedChapters.filter((value) => typeof value === "string")
        : [],
      players: Array.isArray(parsed.players) ? parsed.players : [],
      glory: typeof parsed.glory === "number" ? parsed.glory : 0,
      relics: Array.isArray(parsed.relics) ? parsed.relics : [],
      chapterState: isObject(parsed.chapterState) ? parsed.chapterState : {},
      decisions: isObject(parsed.decisions) ? parsed.decisions : {},
      secretChoices: isObject(parsed.secretChoices) ? parsed.secretChoices : {},
      progression: isObject(parsed.progression) ? parsed.progression : {},
    };

    return payload;
  } catch (error) {
    console.warn("Saved game is corrupted or unreadable:", error);
    removeStorage();
    return null;
  }
}

export function saveGame(state) {
  if (!state || typeof state !== "object") {
    return false;
  }

  const payload = {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    screen: state.screen ?? null,
    chapterId: state.chapterId ?? null,
    cueIndex: typeof state.cueIndex === "number" ? state.cueIndex : 0,
    completedChapters: Array.isArray(state.completedChapters)
      ? state.completedChapters.filter((value) => typeof value === "string")
      : [],
    players: Array.isArray(state.players) ? state.players : [],
    glory: typeof state.glory === "number" ? state.glory : 0,
    relics: Array.isArray(state.relics) ? state.relics : [],
    chapterState: isObject(state.chapterState) ? state.chapterState : {},
    decisions: isObject(state.decisions) ? state.decisions : {},
    secretChoices: isObject(state.secretChoices) ? state.secretChoices : {},
    progression: isObject(state.progression) ? state.progression : {},
  };

  const serialized = JSON.stringify(payload);
  return writeStorage(serialized);
}

export function clearGame() {
  return removeStorage();
}
