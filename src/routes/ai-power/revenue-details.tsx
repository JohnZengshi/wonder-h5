import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, NavBar } from "antd-mobile";
import { useState } from "react";

export const Route = createFileRoute("/ai-power/revenue-details")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [revenues, setRevenues] =
    useState<components["schemas"]["MiningIncomeRecord"][]>();

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/user-mining-machine/income", {
      params: { query: { pageNum: 1, pageSize: 999 } },
    });
    setRevenues(data?.data?.records);
  }, []);

  return (
    <div className="flex flex-col">
      <NavBar onBack={() => window.history.back()}>
        <span className="text-[18px]">收益明细</span>
      </NavBar>
      <div className="px-[14px] pb-[15px] pt-[5px]">
        <div className="flex items-center justify-between border-b-[#9795E9] border-b border-opacity-20 py-[10px]">
          <span className="block w-[120px] text-[12px]">型号</span>
          <span className="text-[12px]">时间</span>
          <span className="block w-[100px] text-end text-[12px]">金额</span>
        </div>
        <ul>
          {revenues?.map((v, i) => (
            <li
              key={i}
              className="h-[44px] flex items-center border-b-[#2A2A2B] border-b"
            >
              <span className="block w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px]">
                {v.coinId}
              </span>
              <span className="text-[14px] flex-1 text-center">
                {v.createTime}
              </span>
              <span className="block w-[100px] text-end text-[14px] text-[#52C41A]">
                ${v.rewardAmount}
              </span>
            </li>
          ))}
          {revenues?.length === 0 && (
            <div className="min-h-[100vh] flex items-center justify-center">
              <Empty />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
