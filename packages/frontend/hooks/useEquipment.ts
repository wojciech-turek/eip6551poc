import BGEquipment from '@/constants/BGEquipment.json';
import { EquipmentContext } from '@/pages/_app';
import { useContext } from 'react';
import { useAccount, useContractWrite } from 'wagmi';

let items: string[] = [
  'https://api.sandbox.game/assets/public/adaeeeef-6d72-4dbd-8d1f-17a1e1cc1af4/preview?bafkreibmd3xgvzecu62c4plunvss27unbebovezbxzo6ejqblz3qnkqozu',
  'https://api.sandbox.game/assets/public/09267734-2a2a-4d79-9250-1b2a73b984a1/preview?bafkreieredvlnown7vz35z75kjdcp4lnirs5cwaz6brmp3pprysmb7n65q',
  'https://api.sandbox.game/assets/public/d53cf6e6-9584-48a0-a3e5-f9c7f63b92fe/preview?bafkreiav2wplrget4nr2mgmx4riofe44zvefrobld4q7mctzdijhmehgaq',
  'https://api.sandbox.game/assets/public/fca2e107-445b-4243-a0da-d049955ada9d/preview?bafkreihpfytfwo4gjs4oqhvax5f3qo63ycndhi5jg7n5omz36hl64vm4by',
  'https://api.sandbox.game/assets/public/16530c37-70c7-4fd8-a11e-53dd68ff0ce6/preview?bafkreib5co5itb5t4vgcdev5lncj2lopfykuhqbulkqhmb2zkrhis5fzzy',
  'https://api.sandbox.game/assets/public/e66de771-b46e-4891-8ebe-c004fd1d251b/preview?bafkreiazhwp6xafek5rtxk3msr6cmz76g2nmnc3h46i44ruhdnlpxyqw4m',
  'https://api.sandbox.game/assets/public/079d9d58-f3dc-447d-ad70-406a761845df/preview?bafkreidnlhblcdqc534uqm4mrukpajjpd37yzzlzfegv44j7uso52rprx4',
  'https://api.sandbox.game/assets/public/848fb363-542f-4828-8fe2-8ce8ff94f049/preview?bafkreiaqhydayoww76wgxs2m6ot4vdkcf5bgmurxn3w6rqsqflehb4utra',
  'https://api.sandbox.game/assets/public/9d9e57cc-ae22-4c16-ba40-9a1c44711965/preview?bafkreigjjbn3suhhmkxxegt5g32yi3hpghzwmbcvanooxv2t2s6k5qxsp4',
  'https://api.sandbox.game/assets/public/a63fac8d-00b1-4d11-ae21-fbc200af18f9/preview?bafkreiamvbrcfgrnuvdk6hrziwjeg7zfxz36x3oxjgsfxkbxxkldezhtpq',
  'https://api.sandbox.game/assets/public/e229417d-fd7a-4962-a6e8-e329be13462e/preview?bafkreiewrgxdn7wroq5ktrtg6for7t2zswwwhz2rdks24xv72i53thqco4',
  'https://api.sandbox.game/assets/public/aa6f34b6-373d-4d8a-a9e7-ee40317a3169/preview?bafkreiffzxqhovklhbjc7xf5dtfaofb4rlpg2yfeww5cwboypxonts4uky',
  'https://api.sandbox.game/assets/public/3e288b22-020d-438e-853a-f0bf912116e3/preview?bafkreiaqpq2zjfug3y5n76jincuuhd7ue2cakv4ll6djdh6sw5be3qlzli',
];

export type Equipment = {
  owner: string;
  id: number;
  image: string;
};

const useEquipment = () => {
  const { myItems } = useContext(EquipmentContext);
  const { address } = useAccount();
  const equipmentContract = {
    address: BGEquipment.address as `0x${string}`,
    abi: BGEquipment.abi,
    chainId: 80001,
  };

  const { writeAsync } = useContractWrite({
    ...equipmentContract,
    functionName: 'safeMint',
    args: [address, items[Math.floor(Math.random() * items.length)]],
  });

  const createEquipment = async () => {
    if (!address) return;
    if (!writeAsync) return;
    await writeAsync();
  };

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
