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
    borderRadius: 10,
    border: isOver ? '1px solid #2507ce' : '1px solid #cdcdcd',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
