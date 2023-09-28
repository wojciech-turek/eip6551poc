import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { EqupimentContractABI } from '@/constants/abi';
import { useContractEvent } from 'wagmi';
import { equipmentContractAddress } from '@/constants/contracts';
import { zeroAddress } from 'viem';

const items = [
  {
    name: 'Prickle Lance',
    imageHash: 'QmbmEbjt41oEjE9DyDLvRbECZX7VtMYxV577ZiHgse57QM',
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
    args: [address, items[0].imageHash, items[0].name],
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
      // @ts-ignore
      // @ts-ignore
      const createdEvent = log.find(
        // @ts-ignore
        (logItem) => logItem.eventName === 'EquipmentCreated'
      ) as {
        args: {
          owner: string;
          name: string;
          tokenId: bigint;
          tokenURI: string;
        };
      };
      if (createdEvent.args.owner !== address) return;
      setMyItems((prev) => [
        ...prev,
        {
          owner: createdEvent.args.owner,
          name: createdEvent.args.name,
          id: Number(createdEvent.args.tokenId),
          image: createdEvent.args.tokenURI.replace(
            'ipfs://',
            'https://ipfs.io/ipfs/'
          ),
        },
      ]);
    },
  });

  useContractEvent({
    ...equipmentContract,
    eventName: 'EquipmentTransferred',
    listener(log) {
      // @ts-ignore
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
                'https://ipfs.io/ipfs/'
              ),
            },
          ];
        }
        return prev;
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
