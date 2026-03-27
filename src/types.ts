export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardState {
  version: 1;
  listOrder: string[];
  lists: Record<string, List>;
  cards: Record<string, Card>;
}

export interface Workspace {
  id: string;
  name: string;
  board: BoardState;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacesState {
  version: 2;
  activeWorkspaceId: string;
  workspaceOrder: string[];
  workspaces: Record<string, Workspace>;
}

/**
 * Generate a stable, deterministic ID.
 * Uses timestamp + random suffix to avoid collisions.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new empty board state.
 */
export function createEmptyBoard(): BoardState {
  return {
    version: 1,
    listOrder: [],
    lists: {},
    cards: {},
  };
}

export function createWorkspace(
  name: string,
  board: BoardState = createEmptyBoard(),
): Workspace {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    board,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultWorkspacesState(
  initialBoard?: BoardState,
): WorkspacesState {
  const first = createWorkspace(
    "Workspace 1",
    initialBoard ?? createEmptyBoard(),
  );
  return {
    version: 2,
    activeWorkspaceId: first.id,
    workspaceOrder: [first.id],
    workspaces: {
      [first.id]: first,
    },
  };
}

export function getDefaultWorkspaceName(state: WorkspacesState): string {
  let maxIndex = 0;
  for (const id of state.workspaceOrder) {
    const workspace = state.workspaces[id];
    if (!workspace) continue;
    const match = /^Workspace\s+(\d+)$/.exec(workspace.name.trim());
    if (match) {
      maxIndex = Math.max(maxIndex, Number(match[1]));
    }
  }
  return `Workspace ${Math.max(1, maxIndex + 1)}`;
}

/**
 * Create a new list with the given title.
 */
export function createList(title: string): List {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    cardIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a new card with the given title and list ID.
 */
export function createCard(
  listId: string,
  title: string,
  description?: string,
): Card {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    listId,
    title,
    description,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Immutable update: add a list to the board.
 */
export function addListToBoard(state: BoardState, list: List): BoardState {
  return {
    ...state,
    listOrder: [...state.listOrder, list.id],
    lists: {
      ...state.lists,
      [list.id]: list,
    },
  };
}

/**
 * Immutable update: remove a list and all its cards from the board.
 */
export function removeListFromBoard(
  state: BoardState,
  listId: string,
): BoardState {
  const { [listId]: _, ...remainingLists } = state.lists;
  const cardIds = state.lists[listId]?.cardIds ?? [];
  const remainingCards = { ...state.cards };
  cardIds.forEach((cardId) => {
    delete remainingCards[cardId];
  });
  return {
    ...state,
    listOrder: state.listOrder.filter((id) => id !== listId),
    lists: remainingLists,
    cards: remainingCards,
  };
}

/**
 * Immutable update: update a list's title.
 */
export function updateListTitle(
  state: BoardState,
  listId: string,
  newTitle: string,
): BoardState {
  const list = state.lists[listId];
  if (!list) return state;
  return {
    ...state,
    lists: {
      ...state.lists,
      [listId]: {
        ...list,
        title: newTitle,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/**
 * Immutable update: add a card to a list.
 */
export function addCardToList(state: BoardState, card: Card): BoardState {
  const list = state.lists[card.listId];
  if (!list) return state;
  return {
    ...state,
    lists: {
      ...state.lists,
      [card.listId]: {
        ...list,
        cardIds: [...list.cardIds, card.id],
        updatedAt: new Date().toISOString(),
      },
    },
    cards: {
      ...state.cards,
      [card.id]: card,
    },
  };
}

/**
 * Immutable update: remove a card from its list.
 */
export function removeCardFromList(
  state: BoardState,
  cardId: string,
): BoardState {
  const card = state.cards[cardId];
  if (!card) return state;
  const list = state.lists[card.listId];
  if (!list) return state;
  const { [cardId]: _, ...remainingCards } = state.cards;
  return {
    ...state,
    lists: {
      ...state.lists,
      [card.listId]: {
        ...list,
        cardIds: list.cardIds.filter((id) => id !== cardId),
        updatedAt: new Date().toISOString(),
      },
    },
    cards: remainingCards,
  };
}

/**
 * Immutable update: update a card's title and description.
 */
export function updateCard(
  state: BoardState,
  cardId: string,
  title: string,
  description?: string,
): BoardState {
  const card = state.cards[cardId];
  if (!card) return state;
  return {
    ...state,
    cards: {
      ...state.cards,
      [cardId]: {
        ...card,
        title,
        description,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/**
 * Immutable update: move a card to a different list and reorder.
 * Updates the source list's cardIds and the card's listId.
 */
export function moveCard(
  state: BoardState,
  cardId: string,
  targetListId: string,
  targetIndex: number,
): BoardState {
  const card = state.cards[cardId];
  if (!card) return state;
  const sourceList = state.lists[card.listId];
  const targetList = state.lists[targetListId];
  if (!sourceList || !targetList) return state;

  const sourceCardIds = sourceList.cardIds.filter((id) => id !== cardId);
  const targetCardIds = [...targetList.cardIds];
  targetCardIds.splice(targetIndex, 0, cardId);

  const isSameList = card.listId === targetListId;

  return {
    ...state,
    lists: {
      ...state.lists,
      [card.listId]: {
        ...sourceList,
        cardIds: isSameList ? targetCardIds : sourceCardIds,
        updatedAt: new Date().toISOString(),
      },
      ...(isSameList
        ? {}
        : {
            [targetListId]: {
              ...targetList,
              cardIds: targetCardIds,
              updatedAt: new Date().toISOString(),
            },
          }),
    },
    cards: {
      ...state.cards,
      [cardId]: {
        ...card,
        listId: isSameList ? card.listId : targetListId,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

/**
 * Immutable update: reorder cards within the same list.
 */
export function reorderCards(
  state: BoardState,
  listId: string,
  cardIds: string[],
): BoardState {
  const list = state.lists[listId];
  if (!list) return state;
  return {
    ...state,
    lists: {
      ...state.lists,
      [listId]: {
        ...list,
        cardIds,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}
