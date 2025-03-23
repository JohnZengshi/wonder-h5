import { createFileRoute } from "@tanstack/react-router";
import { Empty, NavBar, SafeArea } from "antd-mobile";

export const Route = createFileRoute("/wallet-details/log")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <NavBar
        className="!h-[44px] bg-transparent"
        onBack={() => window.history.back()}
      >
        充值记录
      </NavBar>
      <div className="px-[14px]">
        {Array.from({ length: 0 }).map((v, i) => (
          <>
            <div className="flex items-center justify-between h-[37px]">
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-[4px]">
                  <span className="block w-[11px] h-[11px] rounded-[50%] bg-[#FFA2E5]"></span>
                  <span className="text-[14px]">积分</span>
                </div>
                <span className="text-[10px] text-[#666666]">
                  2025.3.15 23:52
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[14px]">+66 USDT</span>
                <span className="text-[12px] text-[#FFA2E5]">充值成功</span>
              </div>
            </div>
            <div className="w-full h-[0.5px] bg-[#2A2A2B] my-[12px]"></div>
          </>
        ))}
        <Empty />
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}
