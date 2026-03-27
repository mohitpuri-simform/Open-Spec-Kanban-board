import { useState, useEffect, useCallback } from "react";
import {
  BoardState,
  WorkspacesState,
  createWorkspace,
  getDefaultWorkspaceName,
} from "../types";
import { loadWorkspacesState, saveWorkspacesState } from "../storage";

export function useWorkspacesState() {
  const [state, setState] = useState<WorkspacesState | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const loaded = loadWorkspacesState();
    setState(loaded);
  }, []);

  const persist = useCallback((nextState: WorkspacesState) => {
    setState(nextState);
    saveWorkspacesState(nextState);
  }, []);

  const setActiveWorkspace = useCallback(
    (workspaceId: string) => {
      if (!state || !state.workspaces[workspaceId]) return;
      persist({ ...state, activeWorkspaceId: workspaceId });
    },
    [state, persist],
  );

  const createAndActivateWorkspace = useCallback(() => {
    if (!state) return;
    const name = getDefaultWorkspaceName(state);
    const workspace = createWorkspace(name);
    persist({
      ...state,
      activeWorkspaceId: workspace.id,
      workspaceOrder: [...state.workspaceOrder, workspace.id],
      workspaces: {
        ...state.workspaces,
        [workspace.id]: workspace,
      },
    });
  }, [state, persist]);

  const renameActiveWorkspace = useCallback(
    (name: string) => {
      if (!state) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      const active = state.workspaces[state.activeWorkspaceId];
      if (!active) return;
      persist({
        ...state,
        workspaces: {
          ...state.workspaces,
          [active.id]: {
            ...active,
            name: trimmed,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    },
    [state, persist],
  );

  const updateActiveBoard = useCallback(
    (board: BoardState) => {
      if (!state) return;
      const active = state.workspaces[state.activeWorkspaceId];
      if (!active) return;
      persist({
        ...state,
        workspaces: {
          ...state.workspaces,
          [active.id]: {
            ...active,
            board,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    },
    [state, persist],
  );

  const activeWorkspace =
    state && state.workspaces[state.activeWorkspaceId]
      ? state.workspaces[state.activeWorkspaceId]
      : null;

  return {
    state,
    activeWorkspace,
    setActiveWorkspace,
    createAndActivateWorkspace,
    renameActiveWorkspace,
    updateActiveBoard,
  };
}
