# Design: Add Trello-style Kanban Board

## Overview

Implement a single-board frontend experience backed by in-memory app state and `localStorage`. The board contains ordered lists, and each list contains ordered todo cards. All mutations update local state first and then persist the committed board snapshot.

## Data model

Use a normalized state shape to keep CRUD and drag-and-drop predictable.

```ts
type BoardState = {
  version: 1;
  listOrder: string[];
  lists: Record<
    string,
    {
      id: string;
      title: string;
      cardIds: string[];
      createdAt: string;
      updatedAt: string;
    }
  >;
  cards: Record<
    string,
    {
      id: string;
      listId: string;
      title: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
    }
  >;
};
```

## Persistence

- Store the board under a versioned key such as `kanban-board:v1`.
- Hydrate once on app startup.
- If storage is empty, initialize a small default board or an empty board with a prompt to add the first list.
- If stored JSON is invalid or incompatible, fall back safely and overwrite with valid state on the next successful mutation.

## State management

- Centralize updates in a reducer or equivalent board state service.
- Generate stable IDs for lists and cards.
- Keep mutations explicit: add/edit/delete list, add/edit/delete card, reorder card, move card.
- Deleting a list cascades deletion of its cards unless product UX later introduces reassignment.

## Drag-and-drop behavior

- Support card reorder inside the same list.
- Support card moves across lists.
- Allow dropping into empty lists.
- Update both `cardIds` order and each moved card’s `listId`.
- Persist only after the final drop action, not on every hover.

## UI structure

- `Board`: owns hydrated board state.
- `ListColumn`: renders title, list actions, card composer, and card drop zone.
- `CardItem`: renders card content and card actions.
- Inline forms or lightweight modals handle create/edit flows.

## Edge cases

- Empty board state.
- Empty list state.
- Duplicate or stale IDs from corrupted storage.
- Deleting the source list or card while editing.
- Keyboard-accessible alternatives for drag-and-drop where supported by the chosen UI approach.

## Acceptance notes

The implementation is complete when users can manage lists and cards entirely on the client, drag cards across lists, refresh the page, and recover the same board state from `localStorage`.
