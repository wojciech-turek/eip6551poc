import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  const AvatarContract = await deployments.get('BGAvatars');

  await execute(
    'Battle',
    { from: deployer },
    'initialize',
    AvatarContract.address
  );

  console.log('Battle contract initialized');
};

export default func;
func.tags = ['EIP6551', 'Battle_setup'];
func.dependencies = [
  'BG_Avatars_deploy',
  'BG_Equipment_deploy',
  'EIP6551Account_deploy',
  'Battle_deploy',
];
