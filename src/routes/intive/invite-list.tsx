import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, NavBar, SafeArea } from "antd-mobile";
import { useState } from "react";

export const Route = createFileRoute("/intive/invite-list")({
  component: RouteComponent,
});

function RouteComponent() {
  const [list, setList] =
    useState<components["schemas"]["UserRecommender"][]>();
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/account/recommender", {
      params: { query: { pageNum: 1, pageSize: 99 } },
    });
    setList(data?.data?.page?.records);
  }, []);
  return (
    <div className="flex flex-col">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => window.history.back()}
      >
        <span className="text-[18px]">我的邀请</span>
      </NavBar>
      <ul className="flex flex-col">
        {list?.map((v, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-[4px] px-[14px] py-[12px] border-b border-opacity-10 border-b-white"
          >
            <div className="w-[36px] h-[36px] rounded-[50%] bg-[#D8D8D8]"></div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px]">{v.userName}</span>
              <span className="text-[10px] text-[#999999]">
                2024.01.20 17：20
              </span>
            </div>
            <span className="text-[14px] ml-auto">非会员</span>
          </li>
        ))}
        {list?.length === 0 && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Empty />
          </div>
        )}
        <SafeArea position="bottom" />
      </ul>
    </div>
  );
}
