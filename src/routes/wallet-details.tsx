import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar, SafeArea } from "antd-mobile";
import { useAsyncEffect } from "ahooks";
import clsx from "clsx";
import { css } from "@/lib/emotion";
import { BaseBtn } from "@/components/BaseBtn";

export const Route = createFileRoute("/wallet-details")({
  validateSearch: (
    search: Record<string, unknown>
  ): { type: "points" | "token" } => {
    if (!search.type || !["points", "token"].includes(search.type as string))
      throw new Error("Invalid asset type");
    return { type: search.type as "points" | "token" };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { type } = Route.useSearch();
  const { navigate } = useRouter();
  // 加载钱包数据
  useAsyncEffect(async () => {}, [type]);

  return (
    <div className="flex flex-col relative min-h-[100vh] bg-[#141414] pb-[12px]">
      <NavBar
        className="!h-[44px] bg-transparent"
        onBack={() => navigate({ to: ".." })}
      >
        {type === "points" ? "平台积分" : "平台代币"}
      </NavBar>

      <div className="flex flex-col px-[14px]">
        <span className="text-[14px] text-[#999]">平台积分</span>
        <span className="text-[14px] flex items-center gap-[6px]">
          <span className="text-[38px] font-bold">899</span>$
        </span>

        <ul className="flex items-center gap-[16.5px] mt-[7px]">
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="充值"
            icon={<span className="i-hugeicons-download-01 text-[24px]"></span>}
          />
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="提币"
            icon={<span className="i-hugeicons-upload-01 text-[24px]"></span>}
          />
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="转账"
            icon={<span className="i-hugeicons-exchange-01 text-[24px]"></span>}
          />
        </ul>
        <div className="rounded-[10px] bg-[#1F1F1F] px-[17px] py-[11px] flex flex-col gap-[17px] mt-[18px]">
          <div className="flex items-center gap-[12px]">
            <span className="text-[24px] text-[#9795E9] i-hugeicons-coins-01"></span>
            <span className="text-[14px]">平台积分地址</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-[#9795E9]">
              0xuhdiabfidaskjnaskjdvnjk
            </span>
            <span className="i-hugeicons-copy-01 text-[24px] text-[#9795E9]"></span>
          </div>
        </div>

        <span className="text-[18px] mt-[16px] mb-[10px]">代币日志</span>

        <ul className="bg-[#1F1F1F] rounded-[10px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between px-[8px] py-[16px]"
            >
              <div className="flex flex-col gap-[4px]">
                <span className="text-[14px]">audhiudhfoasofnak</span>
                <span className="text-[10px] text-[#666666]">
                  2025.3.15 23:52
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[14px] text-[#9795E9]">+999</span>
                <span className="text-[10px] text-[#9795E9]">接收</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
