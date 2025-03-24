import { createAppKit } from "@reown/appkit/react";

import { createConfig, WagmiConfig, WagmiProvider } from "wagmi";
import {
  arbitrum,
  mainnet,
  AppKitNetwork,
  bsc,
  bscTestnet,
  // tron,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { PropsWithChildren } from "react";
import { tron, tronTestnet } from "./network";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = "49b1a650fed65e3cfec27994da2fba35";

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "", // origin must match your domain & subdomain
  icons: [""],
};

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  bsc,
  tron,
  bscTestnet,
  tronTestnet,
];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ["wallet"],
  },
  enableWalletGuide: false,
  allWallets: "HIDE",
  enableWalletConnect: false,
  showWallets: true,
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef",
  ],
});

export function AppKitProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
