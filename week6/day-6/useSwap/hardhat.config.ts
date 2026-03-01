import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: { version: "0.8.28" },
      production: {
        version: "0.8.28",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
      gas: 60000000, // 👈 This sets the transaction gas limit cap
      blockGasLimit: 60000000,
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/vd_C1hdVM-iMPPj3ctprN",
      },
    },

    hardhatOp: {
      type: "edr-simulated",
      chainType: "l1",
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/vd_C1hdVM-iMPPj3ctprN", // still forks mainnet state
        // blockNumber: 24560536,
      },
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
