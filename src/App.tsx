import { AppKitProvider } from "./AppKitProvider";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const hashHistory = createHashHistory();
// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory });

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
