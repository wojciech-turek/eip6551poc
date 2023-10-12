import { useContractWrite } from 'wagmi';
import BattleContract from '@/constants/Battle.json';

const useBattle = () => {
  const battleContract = {
    address: BattleContract.address as `0x${string}`,
    abi: BattleContract.abi,
    chainId: 80001,
  };

  const { writeAsync: battle } = useContractWrite({
    ...battleContract,
    functionName: 'battle',
  });

  const startBattle = async (tokenId1: number, tokenId2: number) => {
    if (!battle) return;
    await battle({
      args: [tokenId1, tokenId2],
    });
  };

  return {
    startBattle,
  };
};

export default useBattle;
