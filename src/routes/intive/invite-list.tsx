import { createFileRoute } from "@tanstack/react-router";
import { NavBar, SafeArea } from "antd-mobile";

export const Route = createFileRoute("/intive/invite-list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => window.history.back()}
      >
        <span className="text-[18px]">我的邀请</span>
      </NavBar>
      <ul className="flex flex-col">
        {Array.from({ length: 20 }).map((_, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-[4px] px-[14px] py-[12px] border-b border-opacity-10 border-b-white"
          >
            <div className="w-[36px] h-[36px] rounded-[50%] bg-[#D8D8D8]"></div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px]">U142144U</span>
              <span className="text-[10px] text-[#999999]">
                2024.01.20 17：20
              </span>
            </div>
            <span className="text-[14px] ml-auto">非会员</span>
          </li>
        ))}
        <SafeArea position="bottom" />
      </ul>
    </div>
  );
}
