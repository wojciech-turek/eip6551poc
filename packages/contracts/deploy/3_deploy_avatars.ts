import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const Account = await deployments.get('ERC6551Account');
  const Registry = await deployments.get('ERC6551Registry');

  await deployments.deploy('BGAvatars', {
    from: deployer,
    contract: 'BGAvatars',
    log: true,
    skipIfAlreadyDeployed: true,
    args: [Account.address, Registry.address],
  });
};

export default func;
func.tags = ['EIP6551', 'BG_Avatars_deploy'];
func.dependencies = ['EIP6551Account_deploy', 'Battle_deploy'];
