import React, { useEffect } from 'react';
import Modal from './Modal';
import useAvatars, { Avatar } from '@/hooks/useAvatars';
import { useAccount } from 'wagmi';
import { classNames } from '@/utils/classNames';

type Props = {
  open: boolean;
  onClose: () => void;
};

const TransferModal = ({ open, onClose }: Props) => {
  const { avatars, transferAvatar } = useAvatars();
  const { address } = useAccount();
  const [myAvatars, setMyAvatars] = React.useState<Avatar[]>([]);
  const [recipientWallet, setRecipientWallet] = React.useState<string>('');

  const [avatarId, setAvatarId] = React.useState<number>(0);

  useEffect(() => {
    const myAvatars = avatars.filter((avatar) => avatar.owner === address);
    setMyAvatars(myAvatars);
    setAvatarId(myAvatars[0]?.id);
  }, [avatars, address]);

  const handleAvatarTransfer = () => {
    transferAvatar(recipientWallet, avatarId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <p className="text-lg tracking-wider text-gray-900">Transfer Avatar</p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <div className="mt-4 text-gray-600 text-sm">
        Select one of your avatars to transfer to someone else and specify the
        wallet address of the recipient.
      </div>
      <div className="mt-2">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-600"
        >
          Avatar ID
        </label>
        <select
          id="location"
          name="location"
          value={avatarId}
          onChange={(e) => setAvatarId(parseInt(e.target.value))}
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6"
        >
          {myAvatars.map((avatar) => (
            <option key={avatar.id} value={avatar.id}>
              {avatar.id}
            </option>
          ))}
        </select>
        <div className="mt-6">
          <input
            type="text"
            name="wallet"
            id="wallet"
            value={recipientWallet}
            onChange={(e) => setRecipientWallet(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0x1234..."
          />
        </div>
        <button
          onClick={handleAvatarTransfer}
          disabled={!recipientWallet}
          className={classNames(
            !recipientWallet
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700',
            'mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none'
          )}
        >
          Transfer
        </button>
      </div>
    </Modal>
  );
};

export default TransferModal;
