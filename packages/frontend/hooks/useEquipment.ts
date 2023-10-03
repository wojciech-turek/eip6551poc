import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { EqupimentContractABI } from '@/constants/abi';
import { useContractEvent } from 'wagmi';
import { equipmentContractAddress } from '@/constants/contracts';
import { zeroAddress } from 'viem';

const items: {
  imageHash: string;
  name: string;
}[] = [
  {
    imageHash: 'QmbmEbjt41oEjE9DyDLvRbECZX7VtMYxV577ZiHgse57QM',
    name: 'Prickle Lance',
  },
  {
    imageHash: 'QmNdLoLrcBTnqSEYSetpFYyW5cxNf7ePuADXh38QKtcC1k',
    name: 'Sorrow',
  },
  {
    imageHash: 'QmPUeYsJ6kbgZnqurksdoMXPhRzsjPxisamc9DyFpAnUpk',
    name: "Heaven's Fall",
  },
  {
    imageHash: 'QmeswyxQ2EgiqDKGPy4KSmW1tPvF7zDiP6khMgEP2xGquZ',
    name: 'Protector',
  },
  {
    imageHash: 'QmYM1H69idL5JvfJ8G9CHPjq9PvhDoJUvHbQAh2aQv1fsN',
    name: 'Albatros Bow',
  },
  {
    imageHash: 'QmXu8eHV6Afq8226yVUWM7GHUuw8ymaiS2f6SuZ9NreAf1',
    name: 'Breaker',
  },
  {
    imageHash: 'QmPJ9f7343cL8KkbVfMiocUu4PyzbbAC9mzr9NxGd3WsKo',
    name: 'Chaos Axe',
  },
  {
    imageHash: 'Qmc7pEbwbCWiFeyAWjtwq6L2XWqUqB5cajxnU1Ej29k6qE',
    name: 'Royal Armor',
  },
  {
    imageHash: 'QmSPmJNvqAvs8RKv8YUnuUFvKNceVZcBhcwDG6Zubqjb4w',
    name: 'Double Blade',
  },
  {
    imageHash: 'QmQ4UoVyFeY1S6k3BR8drMWxhSc4nZ9H7CVsiLjqxs7T69',
    name: 'Flamberg',
  },
  {
    imageHash: 'QmYKYp2A75jMHfNMkKupXbu1hSHWMrWpV47UnRh8BrTT65',
    name: 'Lord Scepter',
  },
  {
    imageHash: 'QmXGbzUAxs21j9MvEjtqw9v5bfF8ichH5VH1GMAD4Ga8L1',
    name: 'Dancer Sword',
  },
];

type Equipment = {
  owner: string;
  name: string;
  id: number;
  image: string;
};

const useEquipment = () => {
  const [myItems, setMyItems] = useState<Equipment[]>([]);
  const { address } = useAccount();
  const equipmentContract = {
    address: equipmentContractAddress,
    abi: EqupimentContractABI,
    chainId: 80001,
  };

  const { writeAsync } = useContractWrite({
    ...equipmentContract,
    functionName: 'safeMint',
    args: [
      address,
      ...Object.values(items[Math.floor(Math.random() * items.length)]),
    ],
  });

  const createEquipment = async () => {
    if (!address) return;
    if (!writeAsync) return;
    await writeAsync();
  };

  useContractEvent({
    ...equipmentContract,
    eventName: 'EquipmentCreated',
    listener(log) {
      const createdEvents: {
        args: {
          owner: string;
          name: string;
          tokenId: bigint;
          tokenURI: string;
        };
      }[] = log.filter(
        // @ts-ignore
        (logItem) => logItem.eventName === 'EquipmentCreated'
      );
      if (!createdEvents.length) return;
      // if none of the events are for the current user, ignore
      const myCreatedEquipment = createdEvents.filter(
        (event) => event.args.owner === address
      );
      if (!myCreatedEquipment.length) return;
      myCreatedEquipment.forEach((createdEvent) => {
        setMyItems((prev) => [
          ...prev,
          {
            owner: createdEvent.args.owner,
            name: createdEvent.args.name,
            id: Number(createdEvent.args.tokenId),
            image: createdEvent.args.tokenURI.replace(
              'ipfs://',
              'https://gray-zygotic-barracuda-960.mypinata.cloud/ipfs/'
            ),
          },
        ]);
      });
    },
  });

  useContractEvent({
    ...equipmentContract,
    eventName: 'EquipmentTransferred',
    listener(log) {
      // @ts-ignore
      const transferEvents: {
        args: {
          from: string;
          to: string;
          tokenId: bigint;
          tokenURI: string;
          name: string;
        };
      }[] = log.filter(
        // @ts-ignore
        (logItem) => logItem.eventName === 'EquipmentTransferred'
      );
      if (!transferEvents.length) return;
      transferEvents.forEach((transferEvent) => {
        setMyItems((prev) => {
          // if its minted ignore
          if (transferEvent.args.from === zeroAddress) return prev;
          if (transferEvent.args.from === address) {
            const index = prev.findIndex(
              (item) => item.id === Number(transferEvent.args.tokenId)
            );
            if (index === -1) return prev;
            const newItems = [...prev];
            newItems.splice(index, 1);
            return newItems;
          }
          if (transferEvent.args.to === address) {
            return [
              ...prev,
              {
                owner: transferEvent.args.to,
                name: transferEvent.args.name,
                id: Number(transferEvent.args.tokenId),
                image: transferEvent.args.tokenURI.replace(
                  'ipfs://',
                  'https://gray-zygotic-barracuda-960.mypinata.cloud/ipfs/'
                ),
              },
            ];
          }
          return prev;
        });
      });
    },
  });

  const { writeAsync: equip } = useContractWrite({
    ...equipmentContract,
    functionName: 'safeTransferFrom',
  });
  // transfer equipment to an avatar
  const equipItem = async (to: string, tokenId: string) => {
    if (!address) return;
    if (!equip) return;
    await equip({ args: [address, to, tokenId] });
  };

  return {
    myItems,
    equipItem,
    createEquipment,
  };
};

export default useEquipment;
