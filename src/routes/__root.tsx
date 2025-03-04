import Login from "@/components/Login";
import useStore from "@/store/useStore";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SafeArea } from "antd-mobile";

export const Route = createRootRoute({
  component: () => {
    const { token } = useStore();
    return (
      <div className="bg-[#141414] w-[100vw] min-h-[100vh]">
        <SafeArea position="top" />
        {token ? <Outlet /> : <Login />}

        {/* <TanStackRouterDevtools /> */}
        <SafeArea position="bottom" />
      </div>
    );
  },
});
