import { MaestroSymphonyProvider, MempoolSpaceProvider } from "@midl/core";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
import "solidity-coverage";
import "tsconfig-paths/register";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// ✅ only load MIDL plugin for deploy runs
const isDeploy =
  process.argv.includes("deploy") ||
  process.argv.includes("--network") ||
  process.argv.some((a) => a.startsWith("deploy:"));

if (isDeploy) {
  require("@midl/hardhat-deploy");
}

const walletsPaths = {
  default: "m/86'/1'/0'/0/0",
};

const accounts = [
  process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
];

const config: HardhatUserConfig = {
  networks: {
    regtest: {
      url: "https://rpc.staging.midl.xyz",
      accounts: {
        mnemonic: accounts[0],
        path: walletsPaths.default,
      },
      chainId: 15001,
    },
  },
  midl: {
    path: "deployments",
    networks: {
      regtest: {
        mnemonic: accounts[0],
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
        hardhatNetwork: "regtest",
        network: {
          explorerUrl: "https://mempool.staging.midl.xyz",
          id: "regtest",
          network: "regtest",
        },
        providerFactory: () =>
          new MempoolSpaceProvider({
            regtest: "https://mempool.staging.midl.xyz",
          }),
        runesProviderFactory: () =>
          new MaestroSymphonyProvider({
            regtest: "https://runes.staging.midl.xyz",
          }),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
};

export default config;