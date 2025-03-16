import { CustomSegmented } from "@/components/CustomSegmented";
import { css } from "@/lib/emotion";
import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, ProgressBar, Segmented } from "antd-mobile";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home/ai-power/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [statistics, setStatistics] =
    useState<components["schemas"]["MiningMachineCountDTO"]>();

  const [miningMachineList, setMiningMachineList] =
    useState<components["schemas"]["UserMiningMachine对象"][]>();
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
    const { data } = await FetchClient.GET(
      "/api/user-mining-machine/miningMachineList",
      { params: { query: { status } } }
    );
    setMiningMachineList(data?.data);
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
        {miningMachineList?.map((v, index) => (
          <li
            key={index}
            className="flex flex-col border-[#4B525C] border p-[12px] rounded-[10px] relative overflow-hidden"
          >
            <div className="flex items-center gap-[14px]">
              <div className="w-[84px] h-[84px] bg-[#3C3C3C] rounded-[10px]"></div>
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
                { label: "购买时间：", value: "2025.03.08 20:27:36" },
                { label: "结束时间：", value: "2025.03.08 20:27:36" },
              ].map((v, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-[10px] text-[#999999]">{v.label}</span>
                  <span className="text-[10px]">{v.value}</span>
                </div>
              ))}
            </div>
            <ProgressBar
              percent={50}
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
        ))}

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
