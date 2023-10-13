import React, { useEffect } from 'react';
import Modal from './Modal';
import useAvatars from '@/hooks/useAvatars';
import { useAccount } from 'wagmi';
import { classNames } from '@/utils/classNames';
import useBattle from '@/hooks/useBattle';
import { zeroAddress } from 'viem';
type Props = {
  open: boolean;
  onClose: () => void;
};

const BattleModal = ({ open, onClose }: Props) => {
  const { startBattle } = useBattle();
  const { address } = useAccount();
  const { avatars } = useAvatars();
  const [mySelectedAvatarId, setMySelectedAvatarId] = React.useState(0);
  const [enemySelectedAvatarId, setEnemySelectedAvatarId] = React.useState(0);

  const handleStartBattle = () => {
    if (!mySelectedAvatarId || !enemySelectedAvatarId) return;
    startBattle(mySelectedAvatarId, enemySelectedAvatarId);
    onClose();
  };

  useEffect(() => {
    setMySelectedAvatarId(0);
    setEnemySelectedAvatarId(0);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-lg tracking-wider text-gray-900">Battle!</p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <div className="mt-4 text-gray-600 text-sm">
        Select one of your avatars to battle with and one of your opponents.
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium leading-6 text-gray-600">
          My Avatar ID
        </label>
        <select
          onChange={(e) => setMySelectedAvatarId(Number(e.target.value))}
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6"
        >
          <option value="" disabled selected>
            Select your avatar Id
          </option>
          {avatars
            .filter((avatar) => avatar.owner === address)
            .map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.id}
              </option>
            ))}
        </select>
        {/* Enemy Select */}
        <label className="block text-sm font-medium leading-6 text-gray-600">
          Enemy Avatar ID
        </label>
        <select
          onChange={(e) => setEnemySelectedAvatarId(Number(e.target.value))}
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6"
        >
          <option value="" disabled selected>
            Select enemy avatar Id
          </option>
          {avatars
            .filter(
              (avatar) =>
                avatar.owner !== address && avatar.owner !== zeroAddress
            )
            .map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.id}
              </option>
            ))}
        </select>
        <button
          onClick={handleStartBattle}
          disabled={!enemySelectedAvatarId || !mySelectedAvatarId}
          className={classNames(
            !enemySelectedAvatarId || !mySelectedAvatarId
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700',
            'mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none'
          )}
        >
          Battle!
        </button>
      </div>
    </Modal>
  );
};

export default BattleModal;
