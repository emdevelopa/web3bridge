/// <reference types="vite/client" />

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {
  liskSepolia as liskSepolia,
  type AppKitNetwork,
} from "@reown/appkit/networks";

// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

export const LiskTestnet: AppKitNetwork = {
  ...liskSepolia,
  id: 4202,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:4202",
};

// 2. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [LiskTestnet];

// 3. Create a metadata object - optional
const metadata = {
  name: "Faucet Dapp",
  description: "Faucet",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: LiskTestnet,
  enableEIP6963: true,
  features: {
    analytics: true,
    allWallets: true,
    email: false,
    socials: [],
  },
});

appkit.switchNetwork(liskSepolia);
