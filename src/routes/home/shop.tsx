import { css } from "@/lib/emotion";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Popup, SafeArea, Stepper } from "antd-mobile";
import { useState } from "react";

export const Route = createFileRoute("/home/shop")({
  component: RouteComponent,
});

const btnBg = css`
  border-radius: 136px;
  opacity: 1;
  background: linear-gradient(180deg, #893af6 0%, #511b7c 100%);
`;

function RouteComponent() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col flex-auto p-[14px] relative">
      <ul className="bg-[#1F1F1F] rounded-[10px] px-[14px] py-[13px] flex flex-col gap-[24px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <li className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[10px]">
              <div>
                <span className="i-mdi-check-circle text-[18px] text-[#893AF6]"></span>
              </div>
              <div className="w-[74px] h-[74px] min-w-[74px] rounded-[9.37px] bg-[#3C3C3C]"></div>
              <div className="flex-auto flex flex-col gap-[3.75px]">
                <span className="text-ellipsis line-clamp-2 text-[14px] text-white">
                  名称名称名称名称名称名称名称名称名称名称名称
                </span>
                <span className="text-ellipsis line-clamp-2 text-[12px] text-[#999999]">
                  商品信息商品信息商品信息商品信息商品信息商品信息
                </span>
              </div>
            </div>
            <div className="flex gap-[8px]">
              <div className="w-[19px] min-w-[19x]"></div>
              <div className="w-[74px] min-w-[74px]"></div>
              <div className="flex-auto flex justify-between items-center">
                <span className="text-[14px]">$999</span>
                <Stepper
                  defaultValue={1}
                  onChange={(value) => {
                    console.log(value);
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <span className="text-[18px]">推荐</span>
      <ul className="flex flex-wrap justify-between gap-[16px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <li className="p-[10px] h-[213px] flex flex-col justify-between bg-[#1F1F1F] rounded-[10px]">
            <div className="w-[145px] h-[164px] rounded-[12.75px] bg-[#3C3C3C]"></div>
            <div className="flex justify-between w-full items-center">
              <span className="text-[12px]">产品名称</span>
              <span className="text-[18px]">
                <span className="text-[#9E9E9E] text-[10.62px]">$ </span>999
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="h-[56px]"></div>
      <SafeArea position="bottom" />

      <div className="w-full fixed bottom-0 left-0 bg-[#191919]">
        <div className="flex items-center gap-[7px] px-[14px] h-[56px]">
          <span className="i-mdi-check-circle text-[18px] text-[#893AF6]"></span>
          <span className="text-[16px]">全选</span>

          <div
            className="flex items-start ml-auto"
            onClick={() => setVisible(true)}
          >
            <span className="text-[12px]">总计：</span>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[16px] text-[#893AF6]">$999</span>
              <div className="flex items-center gap-[5px]">
                <span className="text-[10px] text-[#893AF6]">明细</span>
                <span className="i-mdi-arrow-collapse-up text-[12px] text-[#893AF6]"></span>
              </div>
            </div>
          </div>
          <button
            className={`w-[125px] h-[44px] ml-[20px] flex items-center justify-center ${btnBg}`}
          >
            <span className="text-[16px] font-[600]">结算（1）</span>
          </button>
        </div>
        <SafeArea position="bottom" />
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
      >
        <div className="rounded-t-[18px] p-[14px] flex flex-col pb-[254px]">
          <div className="flex items-center justify-between">
            <span className="text-[18px]">金额明细</span>
            <span className="i-mdi-close-circle text-[22px] text-[#3D3D3D]"></span>
          </div>
          <ul className="flex gap-[20px] flex-wrap mt-[25px]">
            {Array.from({ length: 5 }).map((v) => (
              <li className="relative w-[69px] h-[69px] rounded-[10px] bg-[#3C3C3C]">
                <span className="i-mdi-check-circle text-[#893AF6] text-[12px] absolute right-[7px] top-[8px]"></span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-[10px] mt-[22px]">
            {[
              { label: "商品总价", value: "$999" },
              { label: "平台代币", value: "899/个" },
              { label: "平台积分", value: "$100" },
            ].map((v) => (
              <li className="flex items-center justify-between">
                <span className="text-[14px] ">{v.label}</span>
                <span className="text-[14px]">{v.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </div>
  );
}
