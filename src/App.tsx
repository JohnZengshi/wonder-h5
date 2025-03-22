import { AppKitProvider } from "./AppKitProvider";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { TokenStorage } from "./store/useStore";
import { useEffect } from "react";

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
    // 新增 URL 参数解析逻辑
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      // 这里可以调用您的 token 存储方法
      console.log("URL token:", token);
      TokenStorage.setValue(token);
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
