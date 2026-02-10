require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const MIDL_RPC_URL = process.env.MIDL_RPC_URL || "https://testnet.rpc.midl.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  solidity: "0.8.24",
  networks: {
    midl: {
      url: MIDL_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
  },
};
