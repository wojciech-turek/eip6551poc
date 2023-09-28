import { Draggable } from '@/components/Draggable';
import PlayerCard from '@/components/PlayerCard';
import useAvatars from '@/hooks/useAvatars';
import useEquipment from '@/hooks/useEquipment';
import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { Droppable } from '@/components/Droppable';

const GameRoom = () => {
  const { avatars, createAvatar, setActiveAvatar, unequipItem } = useAvatars();
  const { myItems, createEquipment, equipItem } = useEquipment();

  function handleDragEnd({ over, active }: any) {
    if (
      active?.data?.current?.item?.owner ===
      over?.data?.current?.avatar?.account
    )
      return;

    const account = over?.data?.current?.avatar?.account;
    const itemId = active?.id;
    if (account && itemId) {
      equipItem(account, itemId);
    }
    if (over?.id === 'my-items') {
      unequipItem(active.id);
    }
  }

  const handleDragStart = ({ active }: any) => {
    const avatar = active?.data?.current?.avatar;
    if (avatar) {
      setActiveAvatar(avatar);
    }
  };
  return (
    <div className="mx-auto max-w-7xl sm:py-6 lg:py-24 sm:px-6 lg:px-8">
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex flex-col gap-4 border border-indigo-600 rounded-lg p-4 mb-4">
          <p className="text-3xl font-bold tracking-tight text-gray-900">
            Actions
          </p>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 border border-indigo-300 rounded-md p-4">
              <div>Avatars</div>
              <div className="flex gap-4">
                <button className="btn" onClick={createAvatar}>
                  Mint Avatar
                </button>
                <button className="btn" onClick={createAvatar}>
                  Transfer Avatar
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 border border-indigo-300 rounded-md p-4">
              <div>Equipment</div>
              <div className="flex gap-4">
                <button className="btn" onClick={createEquipment}>
                  Mint Equipment
                </button>
                <button className="btn" onClick={createAvatar}>
                  Transfer Equipment
                </button>
              </div>
            </div>
          </div>
        </div>
        <Droppable id="my-items">
          <div className="p-4">
            <p className="text-lg text-blue-900 pb-2">My Unequipped Items</p>
            <div className="flex gap-4">
              {myItems.map((item) => {
                return (
                  <Draggable id={item.id} item={item} key={item.id}>
                    <div className="flex flex-col items-center justify-center">
                      <img width={80} height={80} src={item.image} />
                      <div className="text-sm text-gray-900">{item.name}</div>
                    </div>
                  </Draggable>
                );
              })}
            </div>
          </div>
        </Droppable>
        <div className="flex gap-4 mt-6">
          <PlayerCard avatars={avatars} />
        </div>
      </DndContext>
    </div>
  );
};

export default GameRoom;