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
    useEffect(() => {
      // 从上下文获取 token（需在根路由配置中注入 store）
      console.log("beforeLoad", token);
      if (!token) {
        navigate({ to: "/login", replace: true });
      } else {
        navigate({ to: "/home", replace: true });
      }
    }, [token]);
    return (
      <div className="bg-[#141414] w-[100vw] min-h-[100vh]">
        <SafeArea position="top" />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
        <SafeArea position="bottom" />
      </div>
    );
  },
});
