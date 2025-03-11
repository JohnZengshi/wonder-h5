import { css } from "@/lib/emotion";
import { createFileRoute } from "@tanstack/react-router";
import { ProgressBar, Segmented } from "antd-mobile";
import clsx from "clsx";

export const Route = createFileRoute("/home/ai-power")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col px-[14px] py-[12px]">
      <div className="bg-[#1A1A1A] rounded-[10px] border-[#9795E9] border px-[16px] py-[13px] flex flex-col gap-[8px]">
        <ul className="flex items-center justify-between">
          <CardItem title="我的算力" value="2888" unit="USDT" />
          <CardItem
            title="我的AI云算力机"
            value="6"
            unit="个"
            className="items-end"
          />
        </ul>

        <ul className="flex items-center justify-between">
          <CardItem title="总收益" value="2888.66" unit="USDT" />
          <CardItem
            title="正在运行"
            value="4"
            unit="个"
            className="items-end"
          />
        </ul>
      </div>
      <div className="flex items-center justify-between mt-[19px]">
        <Segmented
          className={css`
            --segmented-item-selected-background: transparent;
            height: 36px;
            border-radius: 176px;
            opacity: 1;
            background: rgba(0, 0, 0, 0.2);
            box-sizing: border-box;
            border: 1px solid #9795e9;
            box-shadow:
              inset 1.73px 1.73px 12.94px 0px rgba(255, 62, 201, 0.3),
              inset -1.73px -1.73px 12.94px 0px rgba(255, 62, 201, 0.3);
            padding: 4px !important;
            display: flex;
            align-items: center;
            .adm-segmented-group {
              height: 28px;
            }
            .adm-segmented-item {
              height: 28px;
              &.adm-segmented-item-selected {
                border-radius: 104px;
                background-color: #9695e934;
              }
            }
            .adm-segmented-item-label {
              height: 100%;
              line-height: 28px !important;
              font-family: Alibaba PuHuiTi 2;
              font-size: 14px;
              font-weight: normal;
              line-height: normal;
              letter-spacing: 0em;
              font-variation-settings: "opsz" auto;
            }
          `}
          options={["运行中", "待启动", "已过期"]}
        />
        <div className="flex items-center gap-[4px]">
          <span className="text-[12px] text-[#D8D8D8]">收益明细</span>
          <span className="i-hugeicons-arrow-right-01 text-[16px]"></span>
        </div>
      </div>

      <ul className="mt-[12px] flex flex-col gap-[12px]">
        {Array.from({ length: 20 }).map((_, index) => (
          <li
            key={index}
            className="flex flex-col border-[#4B525C] border p-[12px] rounded-[10px] relative overflow-hidden"
          >
            <div className="flex items-center gap-[14px]">
              <div className="w-[84px] h-[84px] bg-[#3C3C3C] rounded-[10px]"></div>
              <ul className="flex flex-col gap-[4px]">
                {[
                  { label: "型号：", value: "dsubfisadifajf" },
                  { label: "周期：", value: "3天" },
                  { label: "购买金额：", value: "99 USDT" },
                  { label: "预计收益：", value: "500 Usdt" },
                  { label: "总收益：", value: "200 Usdt" },
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
        <span className="text-[14px]">{unit}</span>
      </div>
    </li>
  );
}
