import { AppKitProvider } from "./AppKitProvider";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AccountStorage, TokenStorage } from "./store/useStore";
import { useEffect } from "react";
import { penddingRouterParams } from "./routes/wallet-details/pendding";

const hashHistory = createHashHistory();
// Create a new router instance
const router = createRouter({
  routeTree,
  history: hashHistory,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  useEffect(() => {
    // 新增 URL 参数解析逻辑（针对pendding页面）
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(
      urlParams
    ) as unknown as penddingRouterParams;
    if (params.token && params.account) {
      console.log("URL token:", params.token);
      console.log("URL account:", params.account);
      TokenStorage.setValue(params.token);
      AccountStorage.setValue(params.account);
    }
  }, []);
  return (
    <>
      <AppKitProvider>
        <RouterProvider router={router} />
      </AppKitProvider>
    </>
  );
}

export default App;
