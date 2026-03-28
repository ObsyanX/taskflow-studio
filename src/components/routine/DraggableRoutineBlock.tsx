import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RoutineBlock } from '@/types/routine';
import { RoutineBlockCard } from './RoutineBlockCard';

interface Props {
  block: RoutineBlock & { calculatedStart?: number; calculatedEnd?: number };
  onEdit: (block: RoutineBlock) => void;
  onDelete: (id: string) => void;
}

export function DraggableRoutineBlock({ block, onEdit, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <RoutineBlockCard
        block={block}
        calculatedStart={block.calculatedStart}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
