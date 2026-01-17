import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const {
  MNEMONIC,
  RPC_AMOY,
  RPC_SEPOLIA,
  RPC_GANACHE,
  CHAIN_ID_GANACHE,
  CHAIN_ID_SEPOLIA,
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
    },
    ganache: {
      url: RPC_GANACHE || "http://127.0.0.1:7545",
      chainId: CHAIN_ID_GANACHE ? parseInt(CHAIN_ID_GANACHE) : 1337,
      accounts: MNEMONIC ? { mnemonic: MNEMONIC } : undefined,
    },
    sepoliaInfura: {
      url: RPC_SEPOLIA || "",
      accounts: MNEMONIC ? { mnemonic: MNEMONIC } : undefined,
      chainId: CHAIN_ID_SEPOLIA ? parseInt(CHAIN_ID_SEPOLIA) : 11155111,
      gasPrice: 30_000_000_000, // 30 gwei
    },
    polygonAmoy: {
      url: RPC_AMOY || "",
      accounts: MNEMONIC ? { mnemonic: MNEMONIC } : undefined,
      gasPrice: 30_000_000_000, // 30 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
