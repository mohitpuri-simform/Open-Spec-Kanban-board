## Why

The app currently exposes a single hard-coded board with dated custom CSS, which limits organization and makes the experience feel rigid. Users need separate workspaces they can name, switch between, and keep persisted locally while the UI is refreshed to feel modern without losing list/card CRUD or drag-and-drop behavior.

## What Changes

- Add a workspace-aware app shell with a persistent sidebar that lists all workspaces and lets users switch the active workspace.
- Let users create multiple workspaces, default the first workspace name to `Workspace 1`, and support renaming the active workspace.
- Persist all workspace and board data in localStorage, including migration from the current single-board payload.
- Replace the hard-coded in-app and document titles with the active workspace name.
- Introduce Tailwind CSS and modernize the shell, board, empty states, and controls while preserving list/card CRUD and drag-and-drop flows.

## Capabilities

### New Capabilities

- `workspace-management`: Create, rename, persist, and switch between multiple independent kanban workspaces from a sidebar.
- `modernized-board-shell`: Present the board in a responsive, modernized application shell with editable workspace title, polished empty states, and preserved card/list interactions.

### Modified Capabilities

- None.

## Goals

- Support multiple locally persisted workspaces, each with isolated lists, cards, and ordering.
- Preserve existing list/card CRUD and drag-and-drop behavior inside each workspace.
- Refresh the UI using Tailwind CSS with responsive sidebar and board layouts.
- Update the visible title and browser tab title from the active workspace name.

## Non-goals

- Backend sync, collaboration, or account-level workspace sharing.
- New card metadata models beyond the current card fields.
- Reworking the underlying kanban feature set beyond what is required for workspace support and UI modernization.

## User experience

Users land in a two-panel layout with a workspace sidebar and the active board. The initial migrated or empty board appears as `Workspace 1`. Users can create additional workspaces, switch between them from the sidebar, rename the active workspace, and continue using list/card CRUD plus drag-and-drop exactly as before within each workspace. Empty and invalid-storage states remain recoverable and visually clear.

## Success criteria

- Existing board data migrates into a default `Workspace 1` without user intervention.
- Users can create, switch, and rename workspaces and see each board persist after reload.
- List/card CRUD and drag-and-drop continue to work independently inside every workspace.
- The app uses Tailwind-powered styling for the shell and primary board surfaces without breaking responsiveness or accessibility.

## Impact

- Affected code: app shell, board state hook, storage utilities, board and list components, document title handling.
- New dependencies: Tailwind CSS, PostCSS, and Autoprefixer.
- Persistence impact: migrate from single-board localStorage to a versioned multi-workspace structure.
