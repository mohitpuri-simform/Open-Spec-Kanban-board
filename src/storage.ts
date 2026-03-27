import {
  BoardState,
  WorkspacesState,
  createDefaultWorkspacesState,
} from "./types";

const LEGACY_STORAGE_KEY = "kanban-board:v1";
const WORKSPACES_STORAGE_KEY = "kanban-workspaces:v2";

/**
 * Validate a BoardState object to ensure it matches the expected schema.
 */
function isValidBoardState(obj: unknown): obj is BoardState {
  if (!obj || typeof obj !== "object") return false;
  const state = obj as Record<string, unknown>;
  if (state.version !== 1) return false;
  if (!Array.isArray(state.listOrder)) return false;
  if (typeof state.lists !== "object" || state.lists === null) return false;
  if (typeof state.cards !== "object" || state.cards === null) return false;

  const lists = state.lists as Record<string, any>;
  const cards = state.cards as Record<string, any>;

  // Validate each list
  for (const listId of state.listOrder as string[]) {
    const list = lists[listId];
    if (!list || typeof list !== "object") return false;
    if (
      !list.id ||
      !list.title ||
      !Array.isArray(list.cardIds) ||
      !list.createdAt ||
      !list.updatedAt
    ) {
      return false;
    }
  }

  // Validate each card
  for (const cardId in cards) {
    const card = cards[cardId];
    if (!card || typeof card !== "object") return false;
    if (
      !card.id ||
      !card.listId ||
      !card.title ||
      !card.createdAt ||
      !card.updatedAt
    ) {
      return false;
    }
  }

  return true;
}

function isValidWorkspacesState(obj: unknown): obj is WorkspacesState {
  if (!obj || typeof obj !== "object") return false;
  const state = obj as Record<string, unknown>;
  if (state.version !== 2) return false;
  if (typeof state.activeWorkspaceId !== "string") return false;
  if (!Array.isArray(state.workspaceOrder)) return false;
  if (typeof state.workspaces !== "object" || state.workspaces === null) {
    return false;
  }

  const workspaces = state.workspaces as Record<string, any>;
  for (const workspaceId of state.workspaceOrder as string[]) {
    const workspace = workspaces[workspaceId];
    if (!workspace || typeof workspace !== "object") return false;
    if (
      typeof workspace.id !== "string" ||
      typeof workspace.name !== "string" ||
      !workspace.createdAt ||
      !workspace.updatedAt
    ) {
      return false;
    }
    if (!isValidBoardState(workspace.board)) return false;
  }

  return true;
}

/**
 * Load workspace state from localStorage, with migration from legacy board storage.
 */
export function loadWorkspacesState(): WorkspacesState {
  try {
    const workspaceStored = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    if (workspaceStored) {
      const parsed = JSON.parse(workspaceStored);
      if (isValidWorkspacesState(parsed)) {
        return parsed;
      }
      console.warn("Invalid workspace state in storage; attempting migration");
    }

    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyStored) {
      const parsedLegacy = JSON.parse(legacyStored);
      if (isValidBoardState(parsedLegacy)) {
        return createDefaultWorkspacesState(parsedLegacy);
      }
      console.warn(
        "Invalid legacy board state in storage; using empty workspace",
      );
    }

    return createDefaultWorkspacesState();
  } catch (error) {
    console.error("Error loading workspace state from storage:", error);
    return createDefaultWorkspacesState();
  }
}

/**
 * Persist workspace state to localStorage.
 * Silently fails if storage is unavailable.
 */
export function saveWorkspacesState(state: WorkspacesState): void {
  try {
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving workspace state to storage:", error);
    // Fail silently; app continues to work in-memory
  }
}

/**
 * Clear all workspace data from localStorage.
 */
export function clearWorkspacesState(): void {
  try {
    localStorage.removeItem(WORKSPACES_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing workspace state from storage:", error);
  }
}
