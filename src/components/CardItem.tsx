import { FC, useState } from "react";
import { Card, BoardState, removeCardFromList, updateCard } from "../types";

interface CardItemProps {
  card: Card;
  onStateChange: (state: BoardState) => void;
  boardState: BoardState;
  onDragStart: (e: React.DragEvent) => void;
}

const CardItem: FC<CardItemProps> = ({
  card,
  onStateChange,
  boardState,
  onDragStart,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(
    card.description || "",
  );

  const handleDeleteCard = () => {
    const newState = removeCardFromList(boardState, card.id);
    onStateChange(newState);
  };

  const handleSaveCard = () => {
    if (editedTitle.trim()) {
      const newState = updateCard(
        boardState,
        card.id,
        editedTitle,
        editedDescription || undefined,
      );
      onStateChange(newState);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2 rounded-xl border border-teal-700/25 bg-white p-3 shadow-sm">
        <input
          type="text"
          className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          autoFocus
        />
        <textarea
          className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={2}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md bg-teal-700 px-2 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            onClick={handleSaveCard}
          >
            Save
          </button>
          <button
            type="button"
            className="flex-1 rounded-md bg-slate-200 px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex cursor-grab items-start justify-between gap-2 rounded-xl border border-amber-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
    >
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <p className="mb-1 break-words text-sm font-semibold text-slate-800">
          {card.title}
        </p>
        {card.description && (
          <p className="break-words text-xs text-slate-600">
            {card.description}
          </p>
        )}
      </div>
      <button
        type="button"
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-200 text-sm font-bold text-slate-400 transition hover:border-red-400 hover:bg-red-500 hover:text-white"
        onClick={handleDeleteCard}
        title="Delete card"
      >
        ×
      </button>
    </div>
  );
};

export default CardItem;
