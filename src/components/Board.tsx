import { FC, useEffect, useState } from "react";
import { createList, addListToBoard, moveCard, reorderCards } from "../types";
import { BoardState } from "../types";
import ListColumn from "./ListColumn";

interface BoardProps {
  workspaceName: string;
  onRenameWorkspace: (name: string) => void;
  state: BoardState;
  onBoardStateChange: (state: BoardState) => void;
}

const Board: FC<BoardProps> = ({
  workspaceName,
  onRenameWorkspace,
  state,
  onBoardStateChange,
}) => {
  const [newListTitle, setNewListTitle] = useState("");
  const [titleDraft, setTitleDraft] = useState(workspaceName);
  const [dragData, setDragData] = useState<{
    cardId: string;
    sourceListId: string;
  } | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  useEffect(() => {
    setTitleDraft(workspaceName);
  }, [workspaceName]);

  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    const list = createList(newListTitle);
    const newState = addListToBoard(state, list);
    onBoardStateChange(newState);
    setNewListTitle("");
  };

  const handleWorkspaceTitleSave = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(workspaceName);
      return;
    }
    onRenameWorkspace(trimmed);
    setTitleDraft(trimmed);
  };

  const handleCardDragStart = (
    e: React.DragEvent,
    cardId: string,
    sourceListId: string,
  ) => {
    setDragData({ cardId, sourceListId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId, sourceListId }),
    );
  };

  const handleListDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverListId(listId);
  };

  const handleListDragLeave = () => {
    setDragOverListId(null);
  };

  const handleListDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragData) return;

    const { cardId, sourceListId } = dragData;
    const targetList = state.lists[targetListId];

    if (!targetList) {
      setDragData(null);
      setDragOverListId(null);
      return;
    }

    let newState = state;
    if (sourceListId === targetListId) {
      // Reorder within the same list
      const cardIds = [...targetList.cardIds];
      const index = cardIds.indexOf(cardId);
      if (index > -1) {
        cardIds.splice(index, 1);
        cardIds.push(cardId);
        newState = reorderCards(state, targetListId, cardIds);
      }
    } else {
      // Move card to a different list
      const targetIndex = targetList.cardIds.length;
      newState = moveCard(state, cardId, targetListId, targetIndex);
    }

    onBoardStateChange(newState);
    setDragData(null);
    setDragOverListId(null);
  };

  const isEmpty = state.listOrder.length === 0;

  const renderAddListComposer = (centered = false) => (
    <div
      className={`h-fit rounded-xl border border-dashed border-teal-700/30 bg-white/80 p-3 shadow-card ${
        centered ? "mx-auto mt-4 w-full max-w-md" : ""
      }`}
    >
      <input
        type="text"
        placeholder="Add a new list..."
        value={newListTitle}
        onChange={(e) => setNewListTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddList();
        }}
        className="mb-2 w-full rounded-lg border border-teal-800/20 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
      />
      <button
        type="button"
        onClick={handleAddList}
        disabled={!newListTitle.trim()}
        className="w-full rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add List
      </button>
    </div>
  );

  return (
    <section className="flex min-h-full flex-col overflow-hidden bg-gradient-to-br from-[#fffdf8] via-[#fffbf4] to-[#f9f5ea]">
      <header className="border-b border-amber-100/80 px-5 py-4 md:px-8 md:py-6">
        <label
          htmlFor="workspace-title"
          className="mb-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"
        >
          Active Workspace
        </label>
        <input
          id="workspace-title"
          type="text"
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={handleWorkspaceTitleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleWorkspaceTitleSave();
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              setTitleDraft(workspaceName);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-full rounded-xl border border-teal-700/20 bg-white px-3 py-2 text-2xl font-bold tracking-tight text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          aria-label="Workspace name"
        />
      </header>

      {isEmpty && (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="rounded-2xl border border-dashed border-teal-700/25 bg-white/90 px-6 py-8 text-center shadow-card">
            <p className="text-base font-medium text-slate-700">
              This workspace is empty. Create your first list to get started.
            </p>
            {renderAddListComposer(true)}
          </div>
        </div>
      )}

      {!isEmpty && (
        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-8">
          <div className="grid auto-rows-max grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
            {state.listOrder.map((listId) => (
              <div
                key={listId}
                className={`w-full transition ${
                  dragOverListId === listId ? "-translate-y-0.5 opacity-90" : ""
                }`}
                onDragOver={(e) => handleListDragOver(e, listId)}
                onDragLeave={handleListDragLeave}
                onDrop={(e) => handleListDrop(e, listId)}
              >
                <ListColumn
                  list={state.lists[listId]}
                  cards={state.lists[listId].cardIds.map(
                    (id) => state.cards[id],
                  )}
                  onStateChange={onBoardStateChange}
                  boardState={state}
                  onCardDragStart={handleCardDragStart}
                />
              </div>
            ))}

            {renderAddListComposer()}
          </div>
        </div>
      )}
    </section>
  );
};

export default Board;
