"use client";

import { useSyncExternalStore } from "react";
import type { Level } from "./meta";

/**
 * Tiny localStorage-backed store for per-viewer progress.
 * Server snapshot is always empty so prerendered HTML matches the first client render.
 */
export interface UserState {
  watched: string[];
  saved: string[];
  level: Level | "all";
}

const KEY = "devtube:v1";
const EMPTY: UserState = { watched: [], saved: [], level: "all" };

let state: UserState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // storage unavailable (private mode etc.) — keep defaults
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function setState(next: UserState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  // state may have been loaded after the first snapshot was taken
  cb();
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useUserState(): UserState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const actions = {
  toggleWatched(id: string) {
    load();
    const has = state.watched.includes(id);
    setState({ ...state, watched: has ? state.watched.filter((x) => x !== id) : [id, ...state.watched] });
  },
  markWatched(id: string) {
    load();
    if (state.watched.includes(id)) return;
    setState({ ...state, watched: [id, ...state.watched] });
  },
  toggleSaved(id: string) {
    load();
    const has = state.saved.includes(id);
    setState({ ...state, saved: has ? state.saved.filter((x) => x !== id) : [id, ...state.saved] });
  },
  setLevel(level: Level | "all") {
    load();
    setState({ ...state, level });
  },
  clearHistory() {
    load();
    setState({ ...state, watched: [] });
  },
};
