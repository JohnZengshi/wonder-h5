import { AppKitProvider } from "./AppKitProvider";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAsyncEffect } from "ahooks";
import FetchClient from "./server";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <AppKitProvider>
        <RouterProvider router={router} />
      </AppKitProvider>
    </>
  );
}

export default App;
