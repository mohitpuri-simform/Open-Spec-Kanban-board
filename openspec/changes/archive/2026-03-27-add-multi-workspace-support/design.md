## Context

The current app is a React + TypeScript kanban board with a single `BoardState`, custom CSS, and `localStorage` persistence. The requested change is cross-cutting: it adds a new UI dependency stack (Tailwind), introduces a workspace-level data model above the board, changes persistence shape and versioning, and restructures the app from a single board view into a sidebar-plus-content shell.

Constraints:

- No backend or server-side migration path is available; all state must remain client-side.
- Existing users may already have a stored single-board payload that must survive the upgrade.
- List/card CRUD and drag-and-drop behavior must continue to work inside each workspace.
- Empty, corrupted, or partially migrated storage must fail safely.

## Goals / Non-Goals

**Goals:**

- Introduce a `WorkspacesState` model that wraps the existing `BoardState` and tracks active workspace, ordering, and metadata.
- Migrate legacy single-board data into a default `Workspace 1` on first load.
- Add a responsive sidebar for workspace creation and switching.
- Replace the hard-coded board title and document title with the active workspace name, including rename support.
- Move the app shell and primary board surfaces to Tailwind-based styling while preserving accessible CRUD and drag-and-drop flows.

**Non-Goals:**

- Multi-user collaboration, backend sync, or cross-device storage.
- Workspace archiving, deletion policies, duplication, or permission models.
- Replacing the core board data model for lists and cards beyond wrapping it inside a workspace container.

## Decisions

### 1. Add a workspace container above the existing board model

Adopt a new persisted root shape:

```ts
type WorkspacesState = {
  version: 2;
  activeWorkspaceId: string;
  workspaceOrder: string[];
  workspaces: Record<
    string,
    {
      id: string;
      name: string;
      board: BoardState;
      createdAt: string;
      updatedAt: string;
    }
  >;
};
```

Rationale: This preserves the proven board CRUD logic and isolates workspace concerns to the app shell and persistence layer instead of rewriting every list/card mutation.

Alternative considered: flatten lists and cards across all workspaces in one global structure. Rejected because it increases mutation complexity and makes migration harder for little benefit.

### 2. Handle migration during hydration with versioned storage

Read a new storage key first. If missing, read the legacy single-board key and wrap it in a new workspace named `Workspace 1`. If both are missing or invalid, create a default empty workspace.

Rationale: This gives existing users a no-click upgrade path and keeps rollback simple because legacy data is only read, not mutated in place.

Alternative considered: one-time migration script or user-triggered import. Rejected because the app is frontend-only and must self-heal on load.

### 3. Keep board mutations local to the active workspace

The root app component should own `WorkspacesState`, while the existing board component should receive the active workspace board plus callbacks that write updated board state back into the selected workspace.

Rationale: This minimizes churn in list/card CRUD and drag-and-drop logic while making workspace switching explicit.

Alternative considered: rewriting the board hook to manage both workspaces and cards directly. Rejected because it couples unrelated concerns and raises regression risk.

### 4. Use Tailwind for shell and component styling, keep minimal CSS only where necessary

Install Tailwind, PostCSS, and Autoprefixer. Migrate layout, spacing, typography, forms, buttons, sidebar, and board surfaces to utility classes. Retain only narrow CSS rules if drag-and-drop behavior or browser quirks are awkward to express cleanly in utilities.

Rationale: Tailwind provides a fast path to a consistent, modernized UI and makes the new shell easier to evolve.

Alternative considered: continue with handcrafted CSS only. Rejected because the request explicitly calls for Tailwind and a broader UI refresh.

### 5. Treat rename, empty, and invalid-storage states as first-class flows

Workspace rename must reject blank values by restoring the last valid name. Empty workspaces should display a clear prompt to add the first list. Invalid persisted state should fall back to a fresh default workspace and continue working.

Rationale: These are the primary edge cases introduced by the new container model and title editing flow.

## Risks / Trade-offs

- [Migration logic could drop legacy data] → Mitigation: validate the legacy board shape before wrapping it and preserve a straightforward fallback path to a default workspace.
- [Workspace updates may accidentally mutate shared board references] → Mitigation: keep all workspace and board updates immutable and route writes through one update helper.
- [Tailwind migration could leave inconsistent styles during transition] → Mitigation: move shell and primary surfaces in one pass and only remove old CSS once equivalent states are covered.
- [Drag-and-drop behavior may regress after layout changes] → Mitigation: keep drag handlers unchanged where possible and verify same-list reorder, cross-list move, and empty-list drop states manually.

## Migration Plan

1. Add Tailwind dependencies and configuration.
2. Introduce workspace types, storage helpers, and hydration logic with legacy fallback.
3. Refactor the app root into sidebar and main content shell.
4. Wire active workspace selection, creation, rename, and document title sync.
5. Point the existing board UI at the active workspace board and retain current CRUD and drag-and-drop behavior.
6. Verify migration from legacy storage and stable persistence under the new key.

Rollback strategy: revert to the previous app version. Legacy data remains readable until the new workspace store is written, and invalid new storage can be ignored safely by the old version.

## Open Questions

- New workspaces will default to sequential names such as `Workspace 2`; no custom create dialog is needed for this change.
- Workspace deletion is intentionally out of scope for now, so the sidebar only needs create and switch behavior.
