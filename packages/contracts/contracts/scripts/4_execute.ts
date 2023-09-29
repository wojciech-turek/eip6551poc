import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import fs from 'fs';
import {formatEther} from 'ethers/lib/utils';
import {tokenId} from './tokenId';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {deployments, getNamedAccounts} = hre;
  const {deployer} = await getNamedAccounts();

  const Account = await deployments.get('ERC6551Account');
  const BGAvatars = await deployments.get('BGAvatars');
  const BGEquipment = await deployments.get('BGEquipment');

  const value = '0.1';

  // send 0.1 matic to the account of tokenId 1
  const deployerSigner = await hre.ethers.getSigner(deployer);
  const accounts = fs.readFileSync('deployedAccounts.json', 'utf8');
  const accountsJson = JSON.parse(accounts);
  const account = accountsJson.find(
    (a: {tokenId: number; accountAddress: string; contractAddress: string}) =>
      a.tokenId === tokenId && a.contractAddress === BGAvatars.address
  );

  const tx = await deployerSigner.sendTransaction({
    to: account.accountAddress,
    value: hre.ethers.utils.parseEther(value),
  });

  await tx.wait();

  const balance = await hre.ethers.provider.getBalance(account.accountAddress);
  console.log(
    `Account Balance of ${account.accountAddress}`,
    formatEther(balance)
  );

  const accountContract = await hre.ethers.getContractAt(
    Account.abi,
    account.accountAddress
  );

  // await accountContract.execute(
  //   deployer,
  //   hre.ethers.utils.parseEther(value),
  //   '0x',
  //   0
  // );

  // const tx2 = await deployerSigner.sendTransaction({
  //   to: account.accountAddress,
  //   value: hre.ethers.utils.parseEther(value),
  // });

  // await tx2.wait();
  // const balance2 = await hre.ethers.provider.getBalance(account.accountAddress);
  // console.log(
  //   `Account Balance of ${account.accountAddress}`,
  //   formatEther(balance2)
  // );

  // use execute to call BGEquipment contract and mint an item
  const BGEquipmentContract = await hre.ethers.getContractAt(
    BGEquipment.abi,
    BGEquipment.address
  );

  const mintTx = await accountContract.execute(
    BGEquipment.address,
    0,
    BGEquipmentContract.interface.encodeFunctionData('safeMint', [
      account.accountAddress,
      'QmcBSgZQfHPNYKsAjCiuaQdiEc9rCLGHHMucgTwKzjXJ9r',
    ]),
    0
  );

  await mintTx.wait();

  console.log('Item Minted');
};

export default func;
func.tags = ['EIP6551', 'EIP6551_execute'];
func.dependencies = [
  'EIP6551Account_deploy',
  'EIP6551Registry_create_account',
  'BG_Equipment_deploy',
];
