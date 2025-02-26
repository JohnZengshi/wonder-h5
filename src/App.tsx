import { AppKitProvider } from "./AppKitProvider";
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
