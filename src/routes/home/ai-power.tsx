import { CustomSegmented } from "@/components/CustomSegmented";
import { css } from "@/lib/emotion";
import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, ProgressBar, Segmented } from "antd-mobile";
import clsx from "clsx";
import { useEffect, useState } from "react";
import gif_1 from "@/assets/AI/1.gif";
import gif_2 from "@/assets/AI/2.gif";
import gif_3 from "@/assets/AI/3.gif";
import gif_4 from "@/assets/AI/4.gif";

export const Route = createFileRoute("/home/ai-power")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [statistics, setStatistics] =
    useState<components["schemas"]["MiningMachineCountDTO"]>();

  const [miningMachineList, setMiningMachineList] = useState<
    components["schemas"]["UserMiningMachine对象"][]
  >([
    // {
    //   startTime: "2025-03-01 00:00:00",
    //   endTime: "2025-04-15 23:59:59",
    //   machineName: "A100",
    //   validDays: 31,
    //   purchasePrice: "1000 USDT",
    //   totalReward: "1500 USDT",
    //   earnedReward: "500 USDT",
    //   purchaseTime: "2025-03-15 12:00",
    // },
    // {
    //   startTime: "2025-02-10 00:00:00",
    //   endTime: "2025-03-28 23:59:59",
    //   machineName: "H100",
    //   validDays: 92,
    //   purchasePrice: "2000 USDT",
    //   totalReward: "3000 USDT",
    //   earnedReward: "0 USDT",
    //   purchaseTime: "2025-03-01 09:30",
    // },
  ]);
  const [status, setStatus] = useState(1);
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET(
      "/api/user-mining-machine/miningMachineStatistics"
    );
    setStatistics(data?.data);
  }, []);
  useEffect(() => {
    fetchMiningMachineList(1);
  }, []);

  async function fetchMiningMachineList(status: number) {
    setStatus(status);
    const { data } = await FetchClient.GET(
      "/api/user-mining-machine/miningMachineList",
      { params: { query: { status } } }
    );
    setMiningMachineList(data?.data as any);
  }
  return (
    <div className="flex flex-col px-[14px] py-[12px]">
      <div className="bg-[#1A1A1A] rounded-[10px] border-[#9795E9] border px-[16px] py-[13px] flex flex-col gap-[8px]">
        <ul className="flex items-center justify-between">
          <CardItem
            title="我的算力"
            value={statistics?.currentComputingPower ?? "0"}
            unit="USDT"
          />
          <CardItem
            title="我的AI云算力机"
            value={statistics?.miningMachineCountNumber ?? "0"}
            unit="个"
            className="items-end"
          />
        </ul>

        <ul className="flex items-center justify-between">
          <CardItem
            title="总收益"
            value={statistics?.totalRevenue ?? "0"}
            unit="USDT"
          />
          <CardItem
            title="正在运行"
            value={`${statistics?.miningMachineNumber ?? "0"}`}
            unit="个"
            className="items-end"
          />
        </ul>
      </div>
      <div className="flex items-center justify-between mt-[19px]">
        <CustomSegmented
          value={status}
          options={[
            { label: "运行中", value: 1 },
            { label: "待启动", value: 0 },
            { label: "已过期", value: 2 },
          ]}
          onChange={(v) => fetchMiningMachineList(v as number)}
        />
        <div
          className="flex items-center gap-[4px]"
          onClick={() => {
            navigate({ to: "/ai-power/revenue-details" });
          }}
        >
          <span className="text-[12px] text-[#D8D8D8]">收益明细</span>
          <span className="i-hugeicons-arrow-right-01 text-[16px]"></span>
        </div>
      </div>

      <ul className="mt-[12px] flex flex-col gap-[12px]">
        {miningMachineList?.map((v, index) => {
          // 修正后的百分比计算逻辑
          const startStr = (v.startTime || "").replace(" ", "T");
          const endStr = (v.endTime || "").replace(" ", "T");
          const start = new Date(startStr).getTime();
          const end = new Date(endStr).getTime();
          const now = Date.now();
          console.log(new Date(start), new Date(end));
          if (isNaN(start) || isNaN(end) || start >= end) {
            return null; // 添加更严格的校验
          }

          const percent =
            now < start
              ? 0
              : now > end
                ? 100
                : Number((((now - start) / (end - start)) * 100).toFixed(2));

          // 添加调试日志
          console.log("时间详情（本地时间）", {
            start: new Date(start).toLocaleString(),
            end: new Date(end).toLocaleString(),
            now: new Date(now).toLocaleString(),
            diffDays: ((end - start) / 86400000).toFixed(1) + "天",
            percent,
          });
          console.log("percent", percent);
          // 根据进度选择gif（1-4对应0%-100%）
          const videoNumber = Math.min(
            4,
            Math.max(1, Math.floor(percent / 25) + 1)
          );
          const gifSources = [gif_1, gif_2, gif_3, gif_4];
          const gifSrc = gifSources[videoNumber - 1];

          return (
            <li
              key={index}
              className="flex flex-col border-[#4B525C] border p-[12px] rounded-[10px] relative overflow-hidden"
            >
              <div className="flex items-center gap-[14px]">
                <div className="w-[84px] h-[84px] rounded-[10px]">
                  <img
                    src={gifSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <ul className="flex flex-col gap-[4px]">
                  {[
                    { label: "型号：", value: v.machineName },
                    { label: "周期：", value: v.validDays },
                    { label: "购买金额：", value: v.purchasePrice },
                    { label: "预计收益：", value: v.totalReward },
                    { label: "总收益：", value: v.earnedReward },
                  ].map((v, index) => (
                    <li className="flex items-center gap-[4px]" key={index}>
                      <span className="text-[12px] text-[#999999]">
                        {v.label}
                      </span>
                      <span className="text-[12px]">{v.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full h-[1px] bg-[#FFFFFF] opacity-10 my-[8px]"></div>
              <div className="flex flex-col gap-[6px]">
                {[
                  { label: "购买时间：", value: v.purchaseTime },
                  { label: "结束时间：", value: v.endTime },
                ].map((v, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[10px] text-[#999999]">
                      {v.label}
                    </span>
                    <span className="text-[10px]">{v.value}</span>
                  </div>
                ))}
              </div>
              <ProgressBar
                percent={percent}
                className="mt-[4px]"
                style={{
                  "--track-width": "4px",
                }}
              />

              <div
                className={clsx(
                  css`
                    border-radius: 0px 9px 0px 10px;
                    opacity: 1;
                    background: #000000;
                    box-shadow:
                      inset -1.73px -1.73px 12.94px 0px rgba(255, 62, 201, 0.3),
                      inset 1.73px 1.73px 12.94px 0px rgba(255, 62, 201, 0.3);
                  `,
                  "w-[55px] h-[22px] flex items-center justify-center absolute right-0 top-0"
                )}
              >
                <span className="text-[10px] text-[#9795E9]">进行中</span>
              </div>
            </li>
          );
        })}

        {miningMachineList?.length == 0 && (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Empty />
          </div>
        )}
      </ul>
    </div>
  );
}

function CardItem({
  className,
  title,
  unit,
  value,
}: {
  className?: string;
  title: string;
  unit: string;
  value: string;
}) {
  return (
    <li className={clsx("flex flex-col h-[47px] justify-between", className)}>
      <span className="text-[12px] text-[#999999]">{title}</span>
      <div className="flex items-end gap-[2px]">
        <span className="text-[18px]">{value}</span>
        <span className="text-[14px]"> {unit}</span>
      </div>
    </li>
  );
}
