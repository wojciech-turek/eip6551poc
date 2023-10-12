import { Avatar } from '@/hooks/useAvatars';
import { truncateAddress } from '@/utils';
import React from 'react';
import { CopyClipboard } from './CopyClipboard';
import { useAccount } from 'wagmi';
import { Droppable } from './Droppable';
import { Draggable } from './Draggable';
import { classNames } from '@/utils/classNames';
import ExperienceBar from './ExperienceBar';
import Image from 'next/image';
import { zeroAddress } from 'viem';

const PlayerCard = ({ avatars }: { avatars: Avatar[] }) => {
  const { address } = useAccount();

  return (
    <>
      {avatars
        .filter((avatar) => avatar.owner !== zeroAddress)
        .map((avatar) => (
          <div
            className={classNames(
              avatar.owner === address ? 'bg-green-50' : 'bg-white',
              ' rounded-lg relative border border-gray-400 shadow-sm'
            )}
            key={avatar.id}
          >
            {/* absolute position top right id */}
            <div className="relative text-sm text-gray-600 p-2">
              ID: {avatar.id}
            </div>

            <Image
              width={300}
              height={300}
              className="object-cover overflow-hidden mx-auto max-h-42"
              src={avatar.image}
              alt="avatar"
            />
            <div className="p-4">
              <div className="mt-2">
                <p className="text-sm text-center text-gray-600">Experience</p>
                <ExperienceBar currentExp={avatar.experience} />
              </div>
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
                <div className="mt-1 text-sm text-gray-500 py-4">
                  Items Owned
                </div>
                <Droppable id={avatar.id} avatar={avatar}>
                  {avatar.itemsOwned.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 py-2 px-8">
                      {avatar.itemsOwned?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-center"
                        >
                          <Draggable
                            id={item.id}
                            item={item}
                            avatar={avatar}
                            key={item.id}
                          >
                            <Image
                              fill
                              className="object-contain p-2"
                              src={item.image}
                              alt={'item'}
                            />
                          </Draggable>
                        </div>
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
          </div>
        ))}
    </>
  );
};

export default PlayerCard;
