## 1. Tailwind And App Shell Setup

- [ ] 1.1 Add `tailwindcss`, `postcss`, and `autoprefixer`, then create the Tailwind and PostCSS config needed by the Vite app.
- [ ] 1.2 Replace the root stylesheet entry with Tailwind layers and establish the base shell styling tokens for the refreshed layout.
- [ ] 1.3 Refactor the app root from a single board render into a sidebar-plus-main-content shell that can host workspace navigation and the active board.

## 2. Workspace State And Persistence

- [ ] 2.1 Define `Workspace` and `WorkspacesState` types plus helpers for creating default sequential workspaces around the existing `BoardState`.
- [ ] 2.2 Implement versioned localStorage helpers that hydrate the new workspace store, migrate the legacy single-board payload into `Workspace 1`, and recover safely from invalid data.
- [ ] 2.3 Update the board state hook or equivalent state layer so board mutations read from and write back to only the active workspace.

## 3. Workspace Navigation And Title Editing

- [ ] 3.1 Build the sidebar workspace list with active-state styling, create-workspace action, and click-to-switch behavior.
- [ ] 3.2 Add editable active-workspace title handling in the main header, including non-empty validation and immediate persistence.
- [ ] 3.3 Synchronize the browser document title with the active workspace name during hydration, switching, and rename flows.

## 4. Modernized Board Experience

- [ ] 4.1 Move the board shell, empty states, and primary form controls to Tailwind-based styling while keeping loading feedback intact.
- [ ] 4.2 Update list and card presentation to match the refreshed UI without regressing existing create, edit, and delete interactions.
- [ ] 4.3 Verify drag-and-drop still supports same-list reorder, cross-list moves, and empty-list drop targets inside each workspace after the layout changes.

## 5. Verification And Polish

- [ ] 5.1 Manually verify migration from legacy storage, multi-workspace persistence, workspace isolation, and rename behavior across page reloads.
- [ ] 5.2 Verify responsive behavior, keyboard focus states, and empty-state clarity for the sidebar and active board.
- [ ] 5.3 Remove or trim obsolete custom CSS that is superseded by Tailwind while keeping any narrowly required drag-and-drop styles.
