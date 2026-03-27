# Proposal: Add Trello-style Kanban Board

## Summary

Add a frontend-only kanban board that lets users create lists, add todo cards, edit and delete both entities, and drag cards within or across lists. Persist the board in `localStorage` so data survives refreshes without any backend.

## Goals

- Support multiple user-managed lists.
- Support full CRUD for cards inside each list.
- Allow drag-and-drop reordering within a list and moving cards across lists.
- Restore and persist board state from `localStorage`.
- Keep the experience simple, responsive, and accessible.

## Non-goals

- User accounts, collaboration, or real-time sync.
- Server APIs or cloud persistence.
- Advanced card metadata such as labels, comments, due dates, or attachments.

## User experience

Users interact with a single board view made of list columns and todo cards. They can add, rename, and delete lists; add, edit, and delete cards; and drag cards to reorder them or move them into another list. Empty lists remain valid drop targets, and all successful changes save automatically.

## Success criteria

- Board data survives page reloads.
- List and card CRUD can be completed from the board view.
- Drag-and-drop updates the UI immediately and persists the final result.
- Missing or invalid `localStorage` data falls back to a safe default state.
