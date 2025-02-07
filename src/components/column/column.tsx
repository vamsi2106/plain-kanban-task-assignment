import React from "react";
import "./column.css";
import { TaskCard } from "../taskCard";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";

interface Props {
  columnId: number;
  name: string;
  content: any;
  onDelete: any;
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content, onDelete } = props;


  return (
    <div className='containersss'>


      {content.map((card) => (
        <TaskCard key={card.id} content={card} columnId={columnId} onDelete={onDelete} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
