import {hexStripZeros} from 'ethers/lib/utils';
import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import fs from 'fs';
import {tokenId} from './tokenId';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {deployments, getNamedAccounts} = hre;
  const {execute} = deployments;
  const {deployer} = await getNamedAccounts();

  const Account = await deployments.get('ERC6551Account');
  const BGAvatars = await deployments.get('BGAvatars');

  const chainId = 80001;

  const args = [Account.address, chainId, BGAvatars.address, tokenId, 0];

  const accountAlreadyDeployed =
    fs.existsSync('deployedAccounts.json') &&
    JSON.parse(fs.readFileSync('deployedAccounts.json', 'utf8')).find(
      (a: {tokenId: number; accountAddress: string; contractAddress: string}) =>
        a.tokenId === tokenId && a.contractAddress === BGAvatars.address
    );

  if (!accountAlreadyDeployed) {
    const receipt = await execute(
      'ERC6551Registry',
      {from: deployer, log: true},
      'createAccount',
      ...args,
      '0x'
    );

    const event = receipt?.events?.filter((e) =>
      e.topics.includes(
        '0x07fba7bba1191da7ee1155dcfa0030701c9c9a9cc34a93b991fc6fd0c9268d8f'
      )
    );
    const accountAddress = hexStripZeros(event?.[0].data?.substr(0, 2 + 64));
    console.log('Account Created', accountAddress);

    const accountData = {
      tokenId,
      contractAddress: BGAvatars.address,
      accountAddress,
    };

    if (fs.existsSync('deployedAccounts.json')) {
      const prevAccounts = fs.readFileSync('deployedAccounts.json', 'utf8');
      const prevAccountsJson = JSON.parse(prevAccounts);
      prevAccountsJson.push(accountData);
      fs.writeFileSync(
        'deployedAccounts.json',
        JSON.stringify(prevAccountsJson, null, 2)
      );
    } else {
      fs.writeFileSync(
        'deployedAccounts.json',
        JSON.stringify([accountData], null, 2)
      );
    }
  } else {
    console.log(`Account for tokenId ${tokenId} already created `);
  }
};

export default func;
func.tags = ['EIP6551', 'EIP6551_registry_create_account'];
func.dependencies = ['EIP6551Account_deploy'];
