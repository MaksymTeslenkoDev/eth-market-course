const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          keys.MNEMONIC,
          `wss://sepolia.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}}`
        ),
      network_id: "*",
      gasPrice: 3000000000,
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200,
    },
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};
