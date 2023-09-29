import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {tokenId} from './tokenId';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {deployments, getNamedAccounts} = hre;
  const {execute, read} = deployments;
  const {deployer} = await getNamedAccounts();

  if ((await read('BGAvatars', 'totalSupply')) < tokenId) {
    await execute(
      'BGAvatars',
      {from: deployer, log: true},
      'safeMint',
      deployer,
      'QmbMvupACVKJFJejD9HtXFVW39vNf2DFX4peATKn6noQsg'
    );
  }
};

export default func;
func.tags = ['EIP6551', 'BG_Avatars_mint'];
func.dependencies = ['BG_Avatars_deploy'];
