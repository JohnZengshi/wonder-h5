import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-[#141414] w-[100vw] min-h-[100vh]">
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
