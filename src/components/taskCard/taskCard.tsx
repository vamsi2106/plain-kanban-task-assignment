
import React, { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Clock, Calendar, Trash2 } from "lucide-react";
import invariant from "tiny-invariant";
import { GhostCard } from "../ghost-card/ghost-card.component";

interface CardContent {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: "Backlog" | "To-Do" | "In-Progress" | "Done" | "Cancelled";
  priority: "Low" | "Medium" | "High";
  assignee?: string;
  createdAt?: string;
}

interface Props {
  columnId: number;
  content: CardContent;
  onDelete: VoidFunction;
}

const statusStyles: Record<CardContent["status"], { bg: string; text: string; dot: string }> = {
  Backlog: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" },
  "To-Do": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  "In-Progress": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Done: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

const priorityStyles: Record<CardContent["priority"], { bg: string; text: string }> = {
  Low: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Medium: { bg: "bg-amber-100", text: "text-amber-700" },
  High: { bg: "bg-rose-100", text: "text-rose-700" },
};

export const TaskCard: React.FC<Props> = ({ content, columnId, onDelete }) => {
  const [dragging, setDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [content]);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: content.id }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [columnId, content.id]);

  return (
    <>
      <GhostCard show={isDraggedOver} />
      <div
        ref={ref}
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md
          transition-all duration-200
          ${dragging ? "opacity-50" : "opacity-100"}
          ${isDraggedOver ? "scale-105" : "scale-100"}`}
      >
        {/* Header: Title and Priority */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-medium text-gray-900 line-clamp-2">{content.title}</h3>
          <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium
            ${priorityStyles[content.priority].bg} ${priorityStyles[content.priority].text}`}>
            {content.priority}
          </span>
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusStyles[content.status].dot}`} />
            <span className={`text-xs font-medium ${statusStyles[content.status].text}`}>
              {content.status}
            </span>
            <button
              onClick={() => onDelete(content.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Dates */}
          {content.createdAt && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Created: {content.createdAt}</span>
            </div>
          )}

          {(content.startDate || content.endDate) && (
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">
                {content.startDate} {content.endDate && `→ ${content.endDate}`}
              </span>
            </div>
          )}

        </div>
      </div>
    </>
  );
};