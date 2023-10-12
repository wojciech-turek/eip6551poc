import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      avatar: props.avatar,
    },
  });
  const style = {
    borderRadius: 8,
    border: isOver ? '1px solid #07ce32' : '1px solid #2507ce',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
