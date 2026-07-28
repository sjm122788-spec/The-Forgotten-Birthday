import { supabase } from "./supabaseClient";

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const STORAGE_KEYS = {
  role: "forgottenBirthday.multiplayerRole",
  sessionId: "forgottenBirthday.sessionId",
  roomCode: "forgottenBirthday.roomCode",
  hostToken: "forgottenBirthday.hostToken",
  playerId: "forgottenBirthday.playerId",
  playerToken: "forgottenBirthday.playerToken",
  playerName: "forgottenBirthday.playerName",
};

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeLocalStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

function getStoredMultiplayerIdentity() {
  const storage = safeLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    const role = storage.getItem(STORAGE_KEYS.role);
    const sessionId = storage.getItem(STORAGE_KEYS.sessionId);
    const roomCode = storage.getItem(STORAGE_KEYS.roomCode);
    const hostToken = storage.getItem(STORAGE_KEYS.hostToken);
    const playerId = storage.getItem(STORAGE_KEYS.playerId);
    const playerToken = storage.getItem(STORAGE_KEYS.playerToken);
    const playerName = storage.getItem(STORAGE_KEYS.playerName);

    if (!role && !sessionId) {
      return null;
    }

    return {
      role: role || null,
      sessionId: sessionId || null,
      roomCode: roomCode || null,
      hostToken: hostToken || null,
      playerId: playerId || null,
      playerToken: playerToken || null,
      playerName: playerName || null,
    };
  } catch (error) {
    console.warn("Unable to read multiplayer identity:", error);
    return null;
  }
}

function setStoredMultiplayerIdentity(identity) {
  const storage = safeLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    if (identity?.role) {
      storage.setItem(STORAGE_KEYS.role, identity.role);
    } else {
      storage.removeItem(STORAGE_KEYS.role);
    }

    if (identity?.sessionId) {
      storage.setItem(STORAGE_KEYS.sessionId, identity.sessionId);
    } else {
      storage.removeItem(STORAGE_KEYS.sessionId);
    }

    if (identity?.roomCode) {
      storage.setItem(STORAGE_KEYS.roomCode, identity.roomCode);
    } else {
      storage.removeItem(STORAGE_KEYS.roomCode);
    }

    if (identity?.hostToken) {
      storage.setItem(STORAGE_KEYS.hostToken, identity.hostToken);
    } else {
      storage.removeItem(STORAGE_KEYS.hostToken);
    }

    if (identity?.playerId) {
      storage.setItem(STORAGE_KEYS.playerId, identity.playerId);
    } else {
      storage.removeItem(STORAGE_KEYS.playerId);
    }

    if (identity?.playerToken) {
      storage.setItem(STORAGE_KEYS.playerToken, identity.playerToken);
    } else {
      storage.removeItem(STORAGE_KEYS.playerToken);
    }

    if (identity?.playerName) {
      storage.setItem(STORAGE_KEYS.playerName, identity.playerName);
    } else {
      storage.removeItem(STORAGE_KEYS.playerName);
    }

    return true;
  } catch (error) {
    console.warn("Unable to store multiplayer identity:", error);
    return false;
  }
}

function clearStoredMultiplayerIdentity() {
  const storage = safeLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    Object.values(STORAGE_KEYS).forEach((key) => storage.removeItem(key));
    return true;
  } catch (error) {
    console.warn("Unable to clear multiplayer identity:", error);
    return false;
  }
}

function normalizeRoomCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function generateRoomCode() {
  const chars = ROOM_CODE_ALPHABET.split("");

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let code = "";

    for (let index = 0; index < 6; index += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    if (!/^[A-Z0-9]{6}$/.test(code)) {
      continue;
    }

    return code;
  }

  return "BIRTHD";
}

async function createGameSession() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const roomCode = generateRoomCode();
    const hostToken =
      globalThis.crypto?.randomUUID?.() ?? `host-${Date.now()}-${attempt}`;

    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        room_code: roomCode,
        host_token: hostToken,
        status: "lobby",
        current_screen: "lobby",
        game_state: {},
      })
      .select()
      .single();

    if (error) {
      if (error.message?.includes("duplicate") || error.code === "23505") {
        continue;
      }

      throw error;
    }

    return data;
  }

  throw new Error("Unable to create a fresh room after several attempts.");
}

async function findSessionByRoomCode(roomCode) {
  const normalizedCode = normalizeRoomCode(roomCode);

  if (!normalizedCode) {
    return null;
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("room_code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getGameSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function joinGameSession({ sessionId, name }) {
  const trimmedName = String(name ?? "").trim();

  if (!sessionId) {
    throw new Error("A session is required to join.");
  }

  if (!trimmedName) {
    throw new Error("Please enter your name.");
  }

  const { data, error } = await supabase
    .from("players")
    .insert({
      session_id: sessionId,
      role: "guest",
      name: trimmedName,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getSessionPlayers(sessionId) {
  if (!sessionId) {
    return [];
  }

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("joined_at", { ascending: true });

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data : [];
}

async function startGameSession(sessionId, hostToken) {
  if (!sessionId) {
    throw new Error("A session is required to start.");
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .update({
      status: "playing",
      current_screen: "prologue",
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateGameSessionState(sessionId, updates = {}) {
  if (!sessionId) {
    return null;
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function subscribeToGameSession(sessionId, callback) {
  if (!sessionId) {
    return null;
  }

  const channel = supabase.channel(`game-session-${sessionId}`);

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "game_sessions",
      filter: `id=eq.${sessionId}`,
    },
    (payload) => {
      const nextSession = payload?.new ?? payload;
      callback?.(nextSession);
    },
  );

  channel.subscribe();

  return channel;
}

function subscribeToSessionPlayers(sessionId, callback) {
  if (!sessionId) {
    return null;
  }

  const channel = supabase.channel(`game-session-players-${sessionId}`);

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "players",
      filter: `session_id=eq.${sessionId}`,
    },
    (payload) => {
      callback?.(payload?.new ?? payload);
    },
  );

  channel.subscribe();

  return channel;
}

function leaveChannel(channel) {
  if (!channel) {
    return;
  }

  supabase.removeChannel(channel);
}

export {
  clearStoredMultiplayerIdentity as clearMultiplayerIdentity,
  createGameSession,
  findSessionByRoomCode,
  generateRoomCode,
  getGameSession,
  getSessionPlayers,
  getStoredMultiplayerIdentity,
  joinGameSession,
  leaveChannel,
  normalizeRoomCode,
  setStoredMultiplayerIdentity,
  startGameSession,
  subscribeToGameSession,
  subscribeToSessionPlayers,
  updateGameSessionState,
};

export function hasStoredMultiplayerIdentity() {
  return getStoredMultiplayerIdentity() !== null;
}

export function getMultiplayerIdentity() {
  return getStoredMultiplayerIdentity();
}
