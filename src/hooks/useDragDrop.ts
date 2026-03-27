import { useState } from "react";

export interface DragData {
  cardId: string;
  sourceListId: string;
}

export function useDragDrop() {
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    cardId: string,
    sourceListId: string,
  ) => {
    const data: DragData = { cardId, sourceListId };
    setDragData(data);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(data));
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverListId(listId);
  };

  const handleDragLeave = () => {
    setDragOverListId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragData(null);
    setDragOverListId(null);
  };

  return {
    dragData,
    dragOverListId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
