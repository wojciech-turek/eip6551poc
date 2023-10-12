import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  const AvatarContract = await deployments.get('BGAvatars');
  const AccountImplementationContract = await deployments.get('ERC6551Account');
  const RegistryContract = await deployments.get('ERC6551Registry');

  await execute(
    'Battle',
    { from: deployer },
    'initialize',
    AvatarContract.address,
    AccountImplementationContract.address,
    RegistryContract.address
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
