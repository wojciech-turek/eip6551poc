import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy('ERC6551Account', {
    from: deployer,
    contract: 'ERC6551Account',
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

export default func;
func.tags = ['EIP6551', 'EIP6551Account_deploy'];
