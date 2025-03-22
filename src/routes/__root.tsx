import Login from "@/components/Login";
import useStore, { TokenStorage } from "@/store/useStore";
import {
  createRootRoute,
  Outlet,
  createHashHistory,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { SafeArea } from "antd-mobile";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: () => {
    const { navigate } = useRouter();
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
