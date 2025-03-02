import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Swiper } from "antd-mobile";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

const slides = [
  { id: 1, bg: "#3C3C3C", text: "Banner 1" },
  { id: 2, bg: "#893AF6", text: "Banner 2" },
  { id: 3, bg: "#45B7D1", text: "Banner 3" },
];

const colors = ["#ace0ff", "#bcffbd", "#e4fabd", "#ffcfac"];

const items = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div
      className="h-[220px] flex items-center justify-center"
      style={{ background: color }}
      onClick={() => {}}
    >
      {index + 1}
    </div>
  </Swiper.Item>
));

function RouteComponent() {
  const { navigate } = useRouter();
  return (
    <div className="flex flex-auto flex-col items-center px-[14px] py-[12px] gap-[16px]">
      {/* banner */}
      <div className="relative w-[347px] rounded-[15px] overflow-hidden">
        <Swiper autoplay>{items}</Swiper>
      </div>

      {/* 公告 */}
      <div className="w-full flex items-center gap-[14px] px-[14px] h-[54px] rounded-[10px] bg-[#1F1F1F]">
        <span className="i-mdi-bullhorn-outline text-[#893AF6] text-[24px]"></span>
        <span className="text-[14px]">
          这里是很长很长的一句话可以滚动的公告内容
        </span>
      </div>

      <div className="w-[347px] h-[200px] rounded-[10px] bg-[#1F1F1F]"></div>

      <ul className="w-full h-[108px] flex gap-[10px]">
        {[
          { title: "推广赚钱" },
          { title: "联系客服" },
          { title: "官网入口" },
        ].map((v, i) => (
          <li
            key={i}
            className="rounded-[10px] flex-1 h-full bg-[#1F1F1F] relative"
          >
            <span className="text-[14px] absolute bottom-[7px] left-1/2 -translate-x-1/2 whitespace-nowrap">
              {v.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="bg-[#1F1F1F] rounded-[10px]">
        <div className="py-[16px]">
          <span className="ml-[14px] text-[18px] font-bold">会员专区</span>
        </div>
        <ul className="w-full px-[26px] pt-[13px] pb-[27px] gap-[18px] flex justify-between flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="flex flex-col gap-[6px]"
              onClick={() => {
                navigate({ to: "/product" });
              }}
            >
              <div className="w-[130px] h-[130px] rounded-[12px] bg-[#3C3C3C]"></div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]">产品名称</span>
                <span className="text-[12px]">
                  <span className="text-[10px] text-[#9E9E9E]">$ </span>999
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
