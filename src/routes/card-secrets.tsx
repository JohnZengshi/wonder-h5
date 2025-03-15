import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { NavBar } from "antd-mobile";
import { useState } from "react";

export const Route = createFileRoute("/card-secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [cards, setCards] = useState<any[]>();

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/key-card/page", {
      params: { query: { pageNum: 1, pageSize: 999 } },
    });
    setCards(data?.data?.records);
  }, []);
  return (
    <div className="flex flex-col">
      <NavBar onBack={() => window.history.back()}>
        <span className="text-[18px]">我的卡密</span>
      </NavBar>
      <div className="px-[14px] pb-[15px] pt-[5px]">
        <div className="flex items-center justify-between border-b-[#9795E9] border-b border-opacity-20 py-[10px]">
          <span className="block w-[160px] text-[12px]">卡密账号</span>
          <span className="text-[12px] text-nowrap">卡密类型</span>
          <span className="block w-[153px] text-end text-[12px]">获得时间</span>
        </div>
        <ul>
          {cards?.map((v, i) => (
            <li
              key={i}
              className="h-[44px] flex items-center border-b-[#2A2A2B] border-b"
            >
              <div className=" flex items-center w-[160px]">
                <span className="block mr-[4px] w-[81px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px]">
                  U142144U142144U142144
                </span>
                <i className="i-hugeicons-copy-01 text-[20px] text-[#9795E9]"></i>
              </div>
              <span className="text-[14px] text-nowrap">游戏卡</span>
              <span className="block w-[153px] text-end text-[10px] ml-auto">
                2024.01.20 17：20
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
