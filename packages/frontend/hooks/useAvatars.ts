import {
  AccountContractABI,
  AvatarContractABI,
  EqupimentContractABI,
} from '@/constants/abi';
import {
  avatarContractAddress,
  equipmentContractAddress,
} from '@/constants/contracts';
import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { useAccount, useContractEvent, useContractWrite } from 'wagmi';

const avatarHashes: string[] = [
  'QmbMvupACVKJFJejD9HtXFVW39vNf2DFX4peATKn6noQsg',
];

export type Avatar = {
  owner: string;
  account: string;
  id: number;
  image: string;
  itemsOwned: ItemOwned[];
};

export type ItemOwned = {
  name: string;
  id: number;
  image: string;
  owner: string;
};

const useAvatars = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [activeAvatar, setActiveAvatar] = useState<Avatar | null>(null);
  const { address } = useAccount();

  const avatarContract = {
    address: avatarContractAddress,
    abi: AvatarContractABI,
    chainId: 80001,
  };

  const equipmentContract = {
    address: equipmentContractAddress,
    abi: EqupimentContractABI,
    chainId: 80001,
  };

  const accountContract = {
    abi: AccountContractABI,
    chainId: 80001,
  };

  const { writeAsync: mintAvatar } = useContractWrite({
    ...avatarContract,
    functionName: 'safeMint',
    args: [
      address,
      avatarHashes[Math.floor(Math.random() * avatarHashes.length)],
    ],
  });

  const { writeAsync: unequip } = useContractWrite({
    ...accountContract,
    address: (activeAvatar?.account ?? '') as `0x${string}`,
    functionName: 'execute',
  });

  const unequipItem = async (itemId: number) => {
    if (!activeAvatar) return;
    if (!address) return;
    if (!unequip) return;
    await unequip({
      args: [
        equipmentContractAddress,
        0,
        encodeFunctionData({
          abi: EqupimentContractABI,
          args: [activeAvatar?.account ?? '', address, itemId],
          functionName: 'safeTransferFrom',
        }),
        0,
      ],
    });
  };

  const createAvatar = async () => {
    if (!address) return;
    if (!mintAvatar) return;
    await mintAvatar();
  };

  useContractEvent({
    ...avatarContract,
    eventName: 'AvatarCreated',
    listener(log) {
      // @ts-ignore
      const createdEvent = log.find(
        // @ts-ignore
        (logItem) => logItem.eventName === 'AvatarCreated'
      ) as {
        args: {
          owner: string;
          account: string;
          tokenId: bigint;
          tokenURI: string;
        };
      };
      setAvatars((prev) => [
        ...prev,
        {
          owner: createdEvent.args.owner,
          account: createdEvent.args.account,
          id: Number(createdEvent.args.tokenId),
          image: createdEvent.args.tokenURI.replace(
            'ipfs://',
            'https://ipfs.io/ipfs/'
          ),
          itemsOwned: [],
        },
      ]);
    },
  });

  // listen for equipment events to see if it was transferred to one of our avatars
  useContractEvent({
    ...equipmentContract,
    eventName: 'EquipmentTransferred',
    listener(log) {
      console.log(log);
      // @ts-ignore
      const transferEvent = log.find(
        // @ts-ignore
        (logItem) => logItem.eventName === 'EquipmentTransferred'
      ) as {
        args: {
          from: string;
          to: string;
          tokenId: bigint;
          tokenURI: string;
          name: string;
        };
      };
      setAvatars((prev) => {
        const avatar = prev.find(
          (a) =>
            a.account === transferEvent.args.to ||
            a.account === transferEvent.args.from
        );
        if (!avatar) return prev;
        return prev.map((a) => {
          if (transferEvent.args.to === a.account)
            return {
              ...a,
              itemsOwned: [
                ...(a.itemsOwned ?? []),
                {
                  name: transferEvent.args.name,
                  id: Number(transferEvent.args.tokenId),
                  image: transferEvent.args.tokenURI.replace(
                    'ipfs://',
                    'https://ipfs.io/ipfs/'
                  ),
                  owner: transferEvent.args.to,
                },
              ],
            };
          if (transferEvent.args.from === a.account)
            return {
              ...a,
              itemsOwned: a.itemsOwned?.filter(
                (i) => i.id !== Number(transferEvent.args.tokenId)
              ),
            };
          return a;
        });
      });
    },
  });

  const transferAvatar = (to: string, id: number) => {};

  const transferItem = (from: string, to: string, itemId: number) => {};

  return {
    avatars,
    createAvatar,
    setActiveAvatar,
    unequipItem,
    transferAvatar,
  };
};

export default useAvatars;