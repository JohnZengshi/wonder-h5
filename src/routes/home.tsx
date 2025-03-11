import { css } from "@/lib/emotion";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import { useAppKitEvents, useDisconnect } from "@reown/appkit/react";
import { SafeArea } from "antd-mobile";
import { FileRouteTypes } from "@/routeTree.gen";
import clsx from "clsx";
import { BaseBtn } from "@/components/BaseBtn";
import { useEffect } from "react";
import useStore from "@/store/useStore";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

// 新增底部横条样式

const activeTabStyle = css`
  .item {
    width: 24px;
    height: 24px;
    border-radius: 4.8px;
    opacity: 1;
    background: #000000;
    box-shadow: inset 1.2px 1.2px 12px 0px #9b51e0;
    font-size: 12px;
  }
`;

function RouteComponent() {
  const { token } = useStore();
  const events = useAppKitEvents();
  const { disconnect } = useDisconnect();
  const matches = useMatches();
  // 新增路由判断逻辑
  const shouldHideHeader = matches.some(
    (match) =>
      match.fullPath === "/home/ai-power" || match.fullPath === "/home/mine"
  );
  useEffect(() => {
    console.log(matches);
  }, [matches]);
  return (
    <div className="h-full flex flex-col min-h-[100vh] relative">
      {!shouldHideHeader && (
        <div className="h-[44px] flex items-center justify-between px-[14px]">
          <img src={logo} className="w-[32px] h-[32px]" alt="" />
          {token ? (
            <>
              <div
                className={clsx(
                  css`
                    opacity: 1;
                    background: rgba(0, 0, 0, 0.2);
                    box-sizing: border-box;
                    border: 1px solid #9795e9;
                    box-shadow:
                      inset -1.73px -1.73px 12.94px 0px rgba(255, 62, 201, 0.3),
                      inset 1.73px 1.73px 12.94px 0px rgba(255, 62, 201, 0.3);
                  `,
                  "w-[32px] h-[32px] rounded-[50%] flex items-center justify-center"
                )}
              >
                <span className="i-hugeicons-user text-[18px]"></span>
              </div>
            </>
          ) : (
            <BaseBtn title="登录" className="w-[87px] h-[36px]" />
          )}
        </div>
      )}
      <Outlet />

      <div className="h-[56px]"></div>
      <SafeArea position="top" />
      <div className="flex flex-col">
        <ul className="flex justify-between items-center gap-[14px] w-full h-[56px] px-[30px] fixed bottom-0 left-0 bg-[#141414] z-50">
          <NavTab
            text="首页"
            to="/home"
            icon={<span className="i-hugeicons-home-02"></span>}
          />
          <NavTab
            text="分类"
            to="/home/category"
            icon={<span className="i-hugeicons-dashboard-square-01"></span>}
          />
          <Link to="/home/ai-power">
            <li className="flex flex-col items-center gap-[7px] -translate-y-[12px]">
              <div
                className={clsx(
                  "flex items-center justify-center w-[46px] h-[46px] rounded-[50%]",
                  css`
                    opacity: 1;
                    background: #000000;
                    box-shadow: inset 2.31px 2.31px 23.08px 0px #9b51e0;
                  `
                )}
              >
                <span className="i-hugeicons-cpu-charge text-[25.09px] text-white"></span>
              </div>
              <span className="text-[14px] text-white">AI云算力</span>
            </li>
          </Link>
          <NavTab
            text="日志"
            to="/home/cart"
            icon={<span className="i-hugeicons-pen-tool-03"></span>}
          />
          <NavTab
            text="我的"
            to="/home/mine"
            icon={<span className="i-hugeicons-user"></span>}
          />
        </ul>
        <SafeArea position="top" />
      </div>
    </div>
  );
}

// 新增 TabItem 组件
const NavTab = ({
  to,
  text,
  icon,
}: {
  to: FileRouteTypes["to"];
  text: string;
  icon: JSX.Element;
}) => (
  <Link
    to={to}
    activeOptions={{ exact: true }}
    activeProps={{ className: activeTabStyle }}
  >
    <li className="flex flex-col items-center h-[40px] justify-between">
      <div
        className={clsx(
          "item w-[20px] h-[20px] text-[20px] flex items-center justify-center text-white transition-all"
        )}
      >
        {icon}
      </div>
      <span className="text-[10px] text-white">{text}</span>
    </li>
  </Link>
);
