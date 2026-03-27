<img width="1845" height="965" alt="image" src="https://github.com/user-attachments/assets/41630f30-5264-437b-87bc-bc65f33de8cb" />

# Kanban Board

A Trello-style kanban board built with React, TypeScript, and Vite. Supports multiple named workspaces, full list and card management, drag-and-drop, and automatic localStorage persistence — all client-side with no backend required.

## Features

### Multiple Workspaces

- Create as many workspaces as you need from the persistent sidebar
- Switch between workspaces instantly — each one keeps its own independent board state
- First workspace defaults to **Workspace 1**; additional ones are named sequentially
- Rename the active workspace directly from the header — blank names are rejected and the previous name is restored
- The browser tab title always reflects the active workspace name

### Lists

- Add, rename, and delete lists within any workspace
- Lists wrap vertically when the board fills up — no horizontal scrolling required
- Each list renders as a focused column with its own card stack

### Cards

- Add cards to any list with a title and optional description
- Edit or delete cards inline
- Drag cards to reorder them within a list or move them to a different list
- Empty lists remain valid drop targets

### Persistence

- All workspace and board data is saved to `localStorage` automatically on every change
- Data is restored on page reload with no user action required
- Legacy single-board data from older versions is automatically migrated into **Workspace 1**
- Invalid or corrupted storage falls back to a clean default state safely

### Modern UI

- Built with Tailwind CSS — responsive sidebar-plus-board shell
- Warm parchment-toned palette with teal accents
- Accessible keyboard navigation, focus rings, and ARIA labels throughout
- Polished empty states with clear calls to action for new workspaces

## Tech Stack

| Layer       | Technology                      |
| ----------- | ------------------------------- |
| Framework   | React 18 + TypeScript           |
| Build       | Vite 5                          |
| Styling     | Tailwind CSS v4                 |
| State       | React hooks (no external store) |
| Persistence | Browser `localStorage`          |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Board.tsx        # Active workspace board, header, and list management
│   ├── ListColumn.tsx   # Individual list with card stack and add-card form
│   └── CardItem.tsx     # Draggable card with inline edit and delete
├── hooks/
│   └── useBoardState.ts # Workspace state, persistence, and mutation helpers
├── storage.ts           # localStorage read/write with migration and validation
├── types.ts             # Board, list, card, workspace types and immutable helpers
├── App.tsx              # Root shell: sidebar + active board
└── index.css            # Tailwind entry and base styles
```
