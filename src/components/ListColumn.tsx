import { FC, useState } from "react";
import {
  List,
  Card,
  BoardState,
  removeListFromBoard,
  updateListTitle,
  createCard,
  addCardToList,
} from "../types";
import CardItem from "./CardItem";

interface ListColumnProps {
  list: List;
  cards: Card[];
  onStateChange: (state: BoardState) => void;
  boardState: BoardState;
  onCardDragStart: (
    e: React.DragEvent,
    cardId: string,
    sourceListId: string,
  ) => void;
}

const ListColumn: FC<ListColumnProps> = ({
  list,
  cards,
  onStateChange,
  boardState,
  onCardDragStart,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  const handleDeleteList = () => {
    if (confirm(`Delete list "${list.title}"? This will remove all cards.`)) {
      const newState = removeListFromBoard(boardState, list.id);
      onStateChange(newState);
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      const newState = updateListTitle(boardState, list.id, editedTitle);
      onStateChange(newState);
      setIsEditingTitle(false);
    }
  };

  const handleAddCard = () => {
    if (!cardTitle.trim()) return;
    const card = createCard(list.id, cardTitle, cardDescription || undefined);
    const newState = addCardToList(boardState, card);
    onStateChange(newState);
    setCardTitle("");
    setCardDescription("");
    setShowCardForm(false);
  };

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-teal-800/20 bg-[#fffefc] shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-amber-100 px-4 py-3">
        {isEditingTitle ? (
          <input
            type="text"
            className="w-full rounded-md border border-teal-700/30 px-2 py-1 text-base font-semibold text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") setIsEditingTitle(false);
            }}
            autoFocus
          />
        ) : (
          <h2
            className="min-w-0 flex-1 cursor-pointer truncate rounded px-2 py-1 text-base font-bold text-slate-800 transition hover:bg-amber-50"
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit"
          >
            {list.title}
          </h2>
        )}
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-lg font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
          onClick={handleDeleteList}
          title="Delete list"
        >
          ×
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {cards.length === 0 && !showCardForm && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
            <p>No cards yet</p>
          </div>
        )}
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onStateChange={onStateChange}
            boardState={boardState}
            onDragStart={(e) => onCardDragStart(e, card.id, list.id)}
          />
        ))}

        {showCardForm && (
          <div className="space-y-2 rounded-xl border border-teal-700/25 bg-white p-3 shadow-sm">
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
              placeholder="Card title..."
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
              placeholder="Description (optional)"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-md bg-teal-700 px-2 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleAddCard}
                disabled={!cardTitle.trim()}
              >
                Add Card
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-slate-200 px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                onClick={() => {
                  setShowCardForm(false);
                  setCardTitle("");
                  setCardDescription("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showCardForm && (
          <button
            type="button"
            className="rounded-lg border border-dashed border-teal-700/35 bg-teal-50/40 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
            onClick={() => setShowCardForm(true)}
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;
