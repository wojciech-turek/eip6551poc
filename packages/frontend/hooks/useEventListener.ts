import { tokenId } from './../../contracts/contracts/scripts/tokenId';
import { useAccount, useContractEvent } from 'wagmi';
import BGAvatars from '@/constants/BGAvatars.json';
import BGEquipment from '@/constants/BGEquipment.json';
import Battle from '@/constants/Battle.json';
import { zeroAddress } from 'viem';
import { useContext } from 'react';
import {
  AvatarsContext,
  BattleDetailsContext,
  EquipmentContext,
} from '@/pages/_app';

const useEventListener = () => {
  const { setAvatars } = useContext(AvatarsContext);
  const { setMyItems } = useContext(EquipmentContext);
  const { setBattleResultsModalOpen, setBattleDetails } =
    useContext(BattleDetailsContext);
  const { address } = useAccount();

  const avatarContract = {
    address: BGAvatars.address as `0x${string}`,
    abi: BGAvatars.abi,
    chainId: 80001,
  };

  const equipmentContract = {
    address: BGEquipment.address as `0x${string}`,
    abi: BGEquipment.abi,
    chainId: 80001,
  };

  const battleContract = {
    address: Battle.address as `0x${string}`,
    abi: Battle.abi,
    chainId: 80001,
  };

  useContractEvent({
    ...battleContract,
    eventName: 'BattleCommenced',
    listener(log) {
      // @ts-ignore
      const battleEvents: {
        args: {
          tokenId1: bigint;
          tokenId2: bigint;
          winner: bigint;
        };
      }[] = log.filter(
        (logItem) =>
          // @ts-ignore
          logItem.eventName === 'BattleCommenced'
      );
      if (!battleEvents.length) return;
      for (const battleEvent of battleEvents) {
        console.log('Battle Commenced', {
          tokenId1: battleEvent.args.tokenId1,
          tokenId2: battleEvent.args.tokenId2,
          winner: battleEvent.args.winner,
        });
        setBattleDetails({
          token1Id: Number(battleEvent.args.tokenId1),
          token2Id: Number(battleEvent.args.tokenId2),
          winnerId: Number(battleEvent.args.winner),
        });
        setBattleResultsModalOpen(true);
        setAvatars((prev) => {
          return prev.map((a) => {
            if (a.id === Number(battleEvent.args.winner))
              return {
                ...a,
                experience: a.experience + 10,
              };
            return a;
          });
        });
      }
    },
  });

  useContractEvent({
    ...equipmentContract,
    eventName: 'EquipmentCreated',
    listener(log) {
      // @ts-ignore
      const createdEvents: {
        args: {
          owner: string;
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
        console.log('Equipment Created', {
          owner: createdEvent.args.owner,
          tokenId: Number(createdEvent.args.tokenId),
          tokenURI: createdEvent.args.tokenURI,
        });
        setMyItems((prev) => [
          ...prev,
          {
            owner: createdEvent.args.owner,
            id: Number(createdEvent.args.tokenId),
            image: createdEvent.args.tokenURI,
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
        };
      }[] = log.filter(
        (logItem) =>
          // @ts-ignore
          logItem.eventName === 'EquipmentTransferred' &&
          // @ts-ignore
          logItem.args.from !== zeroAddress
      );
      if (!transferEvents.length) return;

      transferEvents.forEach((transferEvent) => {
        console.log('Equipment Transfer', {
          from: transferEvent.args.from,
          to: transferEvent.args.to,
          tokenId: Number(transferEvent.args.tokenId),
          tokenURI: transferEvent.args.tokenURI,
        });
        setMyItems((prev) => {
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
                id: Number(transferEvent.args.tokenId),
                image: transferEvent.args.tokenURI,
              },
            ];
          }
          return prev;
        });
      });
    },
  });

  // listen for equipment events to see if it was transferred to one of our avatars
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
      if (!transferEvents) return;
      transferEvents.forEach((transferEvent) => {
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
                    image: transferEvent.args.tokenURI,
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
      });
    },
  });

  useContractEvent({
    ...avatarContract,
    eventName: 'Transfer',
    listener(log) {
      // @ts-ignore
      const transferEvents: {
        args: {
          from: string;
          to: string;
          tokenId: bigint;
        };
      }[] = log.filter(
        (logItem) =>
          // @ts-ignore
          logItem.eventName === 'Transfer' && logItem.args.from !== zeroAddress
      );
      if (!transferEvents.length) return;
      for (const transferEvent of transferEvents) {
        console.log('Avatar Transfer', {
          from: transferEvent.args.from,
          to: transferEvent.args.to,
          tokenId: Number(transferEvent.args.tokenId),
        });
        setAvatars((prev) => {
          const index = prev.findIndex(
            (avatar) => avatar.id === Number(transferEvent.args.tokenId)
          );
          // update the owner of the avatar
          const newAvatars = [...prev];
          newAvatars[index] = {
            ...newAvatars[index],
            owner: transferEvent.args.to,
          };
          return newAvatars;
        });
      }
    },
  });

  useContractEvent({
    ...avatarContract,
    eventName: 'AvatarCreated',
    listener(log) {
      // @ts-ignore
      const createdEvents: {
        args: {
          owner: string;
          account: string;
          tokenId: bigint;
          tokenURI: string;
        };
      }[] = log.filter(
        // @ts-ignore
        (logItem) => logItem.eventName === 'AvatarCreated'
      );
      if (!createdEvents.length) return;
      for (const createdEvent of createdEvents) {
        console.log('Avatar Created', {
          owner: createdEvent.args.owner,
          account: createdEvent.args.account,
          id: Number(createdEvent.args.tokenId),
          image: createdEvent.args.tokenURI,
        });
        setAvatars((prev) => [
          ...prev,
          {
            owner: createdEvent.args.owner,
            account: createdEvent.args.account,
            id: Number(createdEvent.args.tokenId),
            image: createdEvent.args.tokenURI,
            itemsOwned: [],
            experience: 0,
          },
        ]);
      }
    },
  });
};

export default useEventListener;
