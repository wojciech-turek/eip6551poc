import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: '0.8.18',
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      chainId: 80001,
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: {
        mnemonic:
          process.env.MNEMONIC_MUMBAI ||
          'test test test test test test test test test test test junk',
      },
    },
  },
};

export default config;
