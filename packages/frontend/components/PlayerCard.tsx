import { Avatar } from '@/hooks/useAvatars';
import { truncateAddress } from '@/utils';
import React from 'react';
import { CopyClipboard } from './CopyClipboard';
import { useAccount } from 'wagmi';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { classNames } from '@/utils/classNames';

const PlayerCard = ({ avatars }: { avatars: Avatar[] }) => {
  const { address } = useAccount();

  return (
    <>
      {avatars.map((avatar) => (
        <div
          className={classNames(
            avatar.owner === address ? 'bg-orange-100' : 'bg-white',
            'border border-gray-200 rounded-lg p-4 relative'
          )}
          key={avatar.id}
        >
          {/* absolute position top right id */}
          <div className="relative  text-sm text-gray-600 p-1ś">
            ID: {avatar.id}
          </div>
          <img
            width={120}
            className="object-cover overflow-hidden mx-auto max-h-42"
            src={avatar.image}
            alt="avatar"
          />
          <div className="mt-4">
            <div className="mt-1 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Owner</div>
                <div className="flex gap-2 items-center text-sm text-gray-900">
                  {avatar.owner === address
                    ? 'Me'
                    : truncateAddress(avatar.owner)}
                  <CopyClipboard content={avatar.owner} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Account</div>
                <div className="flex gap-2 items-center text-sm text-gray-900">
                  {truncateAddress(avatar.account)}
                  <CopyClipboard content={avatar.account} />
                </div>
              </div>
            </div>
            <div className="mt-1 border-t border-gray-200"></div>
            <div className="mt-1 text-sm text-gray-500 py-4">Items Owned</div>

            <Droppable id={avatar.id} avatar={avatar}>
              {avatar.itemsOwned.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 py-8 px-2">
                  {avatar.itemsOwned?.map((item) => (
                    <Draggable
                      id={item.id}
                      item={item}
                      avatar={avatar}
                      key={item.id}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <img width={80} height={80} src={item.image} />
                        <div className="text-sm text-gray-900">{item.name}</div>
                      </div>
                    </Draggable>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-900 py-8 px-2">
                  No items owned
                </div>
              )}
            </Droppable>
          </div>
        </div>
      ))}
    </>
  );
};

export default PlayerCard;
