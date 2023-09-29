import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  // networks for mumbai testnet
  networks: {
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: {
        mnemonic: process.env.MNEMONIC_MUMBAI,
      },
    },
  },
};

export default config;
