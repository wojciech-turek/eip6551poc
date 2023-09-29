import { BattleContractABI } from '@/constants/abi';
import { battleContractAddress } from '@/constants/contracts';
import { useContractWrite } from 'wagmi';

const useBattle = () => {
  const battleContract = {
    address: battleContractAddress,
    abi: BattleContractABI,
    chainId: 80001,
  };

  const { writeAsync: battle } = useContractWrite({
    ...battleContract,
    functionName: 'battle',
  });

  const startBattle = async () => {};
};

export default useBattle;
