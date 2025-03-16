import { CustomSegmented } from "@/components/CustomSegmented";
import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute } from "@tanstack/react-router";
import { Empty, Image } from "antd-mobile";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home/log")({
  component: RouteComponent,
});

function RouteComponent() {
  const [order, setOrder] =
    useState<components["schemas"]["CommodityOrderRecord"][]>();
  useEffect(() => {
    fetchOrder(1);
  }, []);

  async function fetchOrder(type: number) {
    const { data } = await FetchClient.GET("/api/commodity-order/page", {
      params: { query: { pageNum: 1, pageSize: 99, type: type } },
    });
    setOrder(data?.data?.records);
  }
  return (
    <div className="flex flex-col px-[14px] py-[11px]">
      <div className="flex">
        <CustomSegmented
          options={[
            { label: "订单日志", value: 1 },
            { label: "算力日志", value: 4 },
          ]}
          onChange={(v) => {
            fetchOrder(v as number);
          }}
        />
      </div>

      <ul className="mt-[18px] flex flex-col gap-[12px]">
        {order?.map((v, index) => (
          <li key={index} className="flex items-center gap-[10px] h-[74px]">
            <div className="w-[74px] min-w-[74px] h-[74px] rounded-[9.73px]">
              <Image src={v.commodityImg} className="w-full h-full" />
            </div>
            <div className="flex flex-col gap-[3.75px]">
              <span className="text-[14px] text-ellipsis overflow-hidden line-clamp-2">
                {v.commodityName}
              </span>
              <span className="text-[12px] text-[#999999]">商品信息</span>
            </div>

            <div className="flex flex-col items-end h-full ml-auto">
              <span className="text-[16.87px]">${v.integral}</span>
              <span className="text-[10px] text-[#999999]">x1</span>
              <span className="text-[12px] text-[#999999] whitespace-nowrap mt-auto">
                {v.createTime}
              </span>
            </div>
          </li>
        ))}
        {order?.length === 0 && (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Empty />
          </div>
        )}
      </ul>
    </div>
  );
}
