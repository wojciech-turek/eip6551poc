import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy('BGEquipment', {
    from: deployer,
    contract: 'BGEquipment',
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

export default func;
func.tags = ['EIP6551', 'BG_Equipment_deploy'];
