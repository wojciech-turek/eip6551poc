import { Draggable } from '@/components/Draggable';
import Image from 'next/image';
import PlayerCard from '@/components/PlayerCard';
import useAvatars from '@/hooks/useAvatars';
import useEquipment from '@/hooks/useEquipment';
import React, { useContext } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Droppable } from '@/components/Droppable';
import TransferModal from '@/components/TransferModal';
import BattleModal from '@/components/BattleModal';
import BumpModal from '@/components/BumpModal';
import useEventListener from '@/hooks/useEventListener';
import { BattleDetailsContext } from './_app';

const GameRoom = () => {
  const [transferModalOpen, setTransferModalOpen] = React.useState(false);
  const [battleModalOpen, setBattleModalOpen] = React.useState(false);
  const { battleDetails, battleResultsModalOpen, setBattleResultsModalOpen } =
    useContext(BattleDetailsContext);
  const {
    avatars,
    createAvatar,
    setActiveAvatar,
    unequipItem,
    transferEquipment,
  } = useAvatars();
  const { myItems, createEquipment, equipItem } = useEquipment();
  useEventListener();

  function handleDragEnd({ over, active }: any) {
    if (
      active?.data?.current?.item?.owner ===
      over?.data?.current?.avatar?.account
    )
      return;

    const account = over?.data?.current?.avatar?.account;
    const itemId = active?.id;
    if (
      active?.data?.current?.avatar?.account &&
      over?.data?.current?.avatar?.account &&
      over?.data?.current?.avatar?.account !==
        active?.data?.current?.avatar?.account
    ) {
      transferEquipment(
        active?.data?.current?.avatar?.account,
        over?.data?.current?.avatar?.account,
        active?.id
      );
      return;
    }
    if (over?.id === 'my-items') {
      unequipItem(active.id);
      return;
    }
    if (account && itemId) {
      equipItem(account, itemId);
    }
  }

  const handleDragStart = ({ active }: any) => {
    const avatar = active?.data?.current?.avatar;
    if (avatar) {
      setActiveAvatar(avatar);
    }
  };
  return (
    <div className="relative mx-auto mt-32 max-w-7xl sm:py-6 lg:py-16 sm:px-6 lg:px-8 bg-white rounded-md bg-opacity-70">
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="flex flex-col gap-4 rounded-lg mb-4">
          <p className="text-3xl font-bold tracking-tight text-gray-700">
            Actions
          </p>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 border border-indigo-600 rounded-md p-4">
              <div>Avatars</div>
              <div className="flex gap-4">
                <button className="btn" onClick={createAvatar}>
                  Mint Avatar
                </button>
                <button
                  className="btn"
                  onClick={() => setTransferModalOpen(true)}
                >
                  Transfer Avatar
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 border border-indigo-600 rounded-md p-4">
              <div>Equipment</div>
              <div className="flex gap-4">
                <button className="btn" onClick={createEquipment}>
                  Mint Equipment
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 border border-indigo-600 rounded-md p-4">
              <div>Battle</div>
              <div className="flex gap-4">
                <button
                  className="btn"
                  onClick={() => setBattleModalOpen(true)}
                >
                  Challenge to battle!
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
                    <Image
                      fill
                      className="object-contain p-2"
                      src={item.image}
                      alt={'item'}
                    />
                  </Draggable>
                );
              })}
            </div>
          </div>
        </Droppable>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <PlayerCard avatars={avatars} />
        </div>
      </DndContext>
      <TransferModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />
      <BattleModal
        open={battleModalOpen}
        onClose={() => setBattleModalOpen(false)}
      />
      <BumpModal
        battleDetails={battleDetails}
        open={battleResultsModalOpen}
        onClose={() => setBattleResultsModalOpen(false)}
      />
    </div>
  );
};

export default GameRoom;
