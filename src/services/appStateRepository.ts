import { doc, getDoc, setDoc } from "firebase/firestore";
import { initialState } from "../data";
import { db } from "../firebase";
import type { AppState } from "../types";

const storageKey = "orderops-app-state";
const docPath = ["appState", "main"] as const;

export async function loadStoredState(): Promise<AppState> {
  if (db) {
    const snapshot = await getDoc(doc(db, ...docPath));
    if (snapshot.exists()) return snapshot.data() as AppState;
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored ? (JSON.parse(stored) as AppState) : initialState;
}

export async function saveStoredState(state: AppState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
  if (db) await setDoc(doc(db, ...docPath), state, { merge: true });
}
