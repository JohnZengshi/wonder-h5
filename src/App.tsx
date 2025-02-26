import { Button } from "antd";
import { AppKitProvider } from "./AppKitProvider";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useDisconnect,
} from "@reown/appkit/react";
import clsx from "clsx";
import { css } from "./lib/emotion";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  // const { open, close } = useAppKit();
  // const { isConnected, status } = useAppKitAccount();
  // const events = useAppKitEvents();
  // const { disconnect } = useDisconnect();
  return (
    <>
      <StyleProvider transformers={[px2remTransformer({ rootValue: 37.5 })]}>
        <AppKitProvider>
          <RouterProvider router={router} />
        </AppKitProvider>
      </StyleProvider>
    </>
  );
}

export default App;
