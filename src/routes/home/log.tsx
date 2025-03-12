import { CustomSegmented } from "@/components/CustomSegmented";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/log")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col px-[14px] py-[11px]">
      <div className="flex">
        <CustomSegmented options={["订单日志", "算力日志"]} />
      </div>

      <ul className="mt-[18px] flex flex-col gap-[12px]">
        {Array.from({ length: 20 }).map((_, index) => (
          <li key={index} className="flex items-center gap-[10px] h-[74px]">
            <div className="w-[74px] min-w-[74px] h-[74px] rounded-[9.73px] bg-[#3C3C3C]"></div>
            <div className="flex flex-col gap-[3.75px]">
              <span className="text-[14px] text-ellipsis overflow-hidden line-clamp-2">
                名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称
              </span>
              <span className="text-[12px] text-[#999999]">商品信息</span>
            </div>

            <div className="flex flex-col items-end h-full">
              <span className="text-[16.87px]">$999</span>
              <span className="text-[10px] text-[#999999]">x1</span>
              <span className="text-[12px] text-[#999999] whitespace-nowrap mt-auto">
                2025.03.08 22:57
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
