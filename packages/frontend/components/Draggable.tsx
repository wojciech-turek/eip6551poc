import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      item: props.item,
      avatar: props.avatar,
    },
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
    zIndex: 9,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      className="relative w-24 h-24 rounded-md shadow-md bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700"
      {...listeners}
      {...attributes}
    >
      {props.children}
    </button>
  );
}
