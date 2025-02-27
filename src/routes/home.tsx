import { css } from "@/lib/emotion";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useDisconnect,
} from "@reown/appkit/react";
import { SafeArea } from "antd-mobile";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

// 新增底部横条样式
const activeIndicator = css`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: -2px; // 向下偏移容器高度
    left: 50%;
    transform: translateX(-50%);
    width: calc(100%); // 与左右padding匹配
    height: 2px;
    background: #893af6;
    border-radius: 1px;
  }
`;

const activeTabStyle = css`
  ${activeIndicator}
  background: rgba(137, 58, 246, 0.2);
  color: #893af6;
`;

function RouteComponent() {
  const { open, close } = useAppKit();
  const { isConnected, status } = useAppKitAccount();
  const events = useAppKitEvents();
  const { disconnect } = useDisconnect();
  return (
    <div className="h-full flex flex-col min-h-[100vh] relative">
      <div className="flex items-center gap-[14px] w-full h-[44px] px-[14px] fixed top-0 left-0 bg-[#141414] z-50">
        <img src={logo} className="w-[36px] h-[36px]" alt="" />
        <div className="flex items-center h-full">
          <NavTab to="/home" text="首页" exact />
          <NavTab to="/home/category" text="分类" />
          <NavTab to="/home/shop" text="购物车" />
        </div>

        <div
          className="flex items-center ml-auto gap-[8px] px-[15px] py-[6px] rounded-[76px] bg-white bg-opacity-10"
          onClick={() => {
            open();
          }}
        >
          {isConnected ? (
            <>
              <img src={logo} className="w-[26px] h-[26px]" alt="" />
              <span className="i-material-symbols-keyboard-arrow-down text-[22px] opacity-80"></span>
            </>
          ) : (
            <span className="i-mdi-wallet text-[22px] opacity-80"></span>
          )}
        </div>

        <span className="i-material-symbols-language text-[22px] opacity-80"></span>
      </div>

      <div className="h-[44px]"></div>
      <SafeArea position="top" />

      <Outlet />
    </div>
  );
}

// 新增 TabItem 组件
const NavTab = ({
  to,
  text,
  exact = false,
}: {
  to: string;
  text: string;
  exact?: boolean;
}) => (
  <Link
    to={to}
    activeOptions={{ exact }}
    activeProps={{ className: activeTabStyle }}
    className="flex h-full items-center justify-center px-[8px] relative text-white"
  >
    <span className="text-[14px]">{text}</span>
  </Link>
);
