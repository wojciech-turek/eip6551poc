import ERC6551Account from '@/constants/ERC6551Account.json';
import BGAvatars from '@/constants/BGAvatars.json';
import BGEquipment from '@/constants/BGEquipment.json';
import { useContext, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { useAccount, useContractWrite } from 'wagmi';
import { AvatarsContext } from '@/pages/_app';

const avatarHashes: string[] = [
  'https://api.sandbox.game/avatars/presets/6976cc63-8127-45ba-af90-31ddd494c6f1/thumbnail.png?QmcC3jZGwahxCgM75fRTTNsWdXvyq8sYkRfCijVYaVpdDg',
  'https://api.sandbox.game/avatars/presets/941ac0be-63f1-4f94-bc30-8bcc2f6fc31a/thumbnail.png?QmRfoW1AUuHxwwNR8qzcsDZYQR2b1UNscw7RSfrFYprcPN',
  'https://api.sandbox.game/avatars/presets/c3b99f97-714f-4ad3-aa2b-12d4f511fa54/thumbnail.png?QmfC5VAVMwNq7sFJLBSGAhyXK7cvLhRQbJu9izuWdNHjSe',
  'https://api.sandbox.game/avatars/presets/b768f1ee-95db-46b0-86fd-4e2eaac3b537/thumbnail.png?QmZYtCH1v7URKXAvCtudoJg9RWjsAq1vVgGLRaS64kP34G',
  'https://api.sandbox.game/avatars/presets/0fb42263-cd7b-4c43-91a3-ddfc8bd0e8e6/thumbnail.png?QmSjs46LSQpoW64mhBr8ywuAMSnmLt3EDkSDK7LyvowGmd',
  'https://api.sandbox.game/avatars/presets/b5a9e3d5-768c-4f90-bb15-857ddb4bc720/thumbnail.png?QmSrxN92nvtwRgSSeYmWv6PdcwPhufref9eVATfDRdze66',
  'https://api.sandbox.game/avatars/presets/a55ca6fc-8f84-40a5-a6fa-c891806f1f3d/thumbnail.png?QmNVuYQeUBhJwNrazNBZkEB5rxM3PHZ6SNdFsAMNVu5fVQ',
  'https://api.sandbox.game/avatars/presets/2ec3d414-cb18-47cd-a761-b5c89d50fdb4/thumbnail.png?QmXerMpXyq7TCnfciFda1LBJ6UVK6yjzNzVnTQtSyzTdoc',
  'https://api.sandbox.game/avatars/presets/db9eaec6-e631-49b3-8a30-2c31733ac20f/thumbnail.png?QmPRkcxh5NreR1kEvgzzi1c56m3eMqR6YnmmbuBkQwQRDF',
  'https://api.sandbox.game/avatars/presets/50b855cb-3d11-478d-bafc-e4bbc2b8b636/thumbnail.png?QmawmczpT4zevyxkhJoLkA2WmsqDG4PDFERVTBh8AE1A6U',
  'https://api.sandbox.game/avatars/presets/bbdd8be1-8f0c-4475-a799-611fc1866473/thumbnail.png?QmV5iaEUKHQ88dUyoUsNTzeUXXtf95gn1C6khBFmV8MKZD',
  'https://api.sandbox.game/avatars/presets/13a3b5bc-6045-4d95-853d-a07f850b5fc1/thumbnail.png?QmZ3jWyAmfNjbakjHJMG3Mjn6TikqfVGsy4FnHHU3d4HXf',
  'https://api.sandbox.game/avatars/presets/bc832d7d-1e4e-4131-af42-3141af12779f/thumbnail.png?QmdNa3UZKtbNwC7mkuii7yJnnCGMLdfgEHcNGcs19VaQtr',
  'https://api.sandbox.game/avatars/presets/299075af-0ab9-49b7-9a4b-84567b3b101d/thumbnail.png?QmeEQZgCoiwrNTGmJwGMdhPYhZWQaNswxQNeAKkhZnL8Qr',
  'https://api.sandbox.game/avatars/presets/8fa80bf6-0761-45eb-8c8d-f258d3348e5a/thumbnail.png?QmQuuXFLXzChKd4voAtwFk2tzbs3HxJHjrxT1BJeEuNm7d',
];

export type Avatar = {
  owner: string;
  account: string;
  id: number;
  image: string;
  experience: number;
  itemsOwned: ItemOwned[];
};

export type ItemOwned = {
  name: string;
  id: number;
  image: string;
  owner: string;
};

const useAvatars = () => {
  const { avatars } = useContext(AvatarsContext);
  const [activeAvatar, setActiveAvatar] = useState<Avatar | null>(null);
  const { address } = useAccount();

  const avatarContract = {
    address: BGAvatars.address as `0x${string}`,
    abi: BGAvatars.abi,
    chainId: 80001,
  };

  const accountContract = {
    abi: ERC6551Account.abi,
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
        BGEquipment.address,
        0,
        encodeFunctionData({
          abi: BGEquipment.abi,
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

  const { writeAsync: transfer } = useContractWrite({
    ...avatarContract,
    functionName: 'safeTransferFrom',
  });

  const transferAvatar = (to: string, id: number) => {
    if (!address) return;
    if (!transfer) return;
    transfer({
      args: [address, to, id],
    });
  };

  const { writeAsync: transferItem } = useContractWrite({
    ...accountContract,
    address: (activeAvatar?.account ?? '') as `0x${string}`,
    functionName: 'execute',
  });

  const transferEquipment = (from: string, to: string, itemId: number) => {
    if (!address) return;
    if (!transferItem) return;
    transferItem({
      args: [
        BGEquipment.address,
        0,
        encodeFunctionData({
          abi: BGEquipment.abi,
          args: [from, to, itemId],
          functionName: 'safeTransferFrom',
        }),
        0,
      ],
    });
  };

  return {
    avatars,
    createAvatar,
    setActiveAvatar,
    unequipItem,
    transferEquipment,
    transferAvatar,
  };
};

export default useAvatars;
