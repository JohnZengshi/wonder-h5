import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SafeArea } from "antd-mobile";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-[#141414] w-[100vw] min-h-[100vh]">
      <SafeArea position="top" />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <SafeArea position="bottom" />
    </div>
  ),
});
