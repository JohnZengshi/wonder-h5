import { createFileRoute } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

const slides = [
  { id: 1, bg: "#3C3C3C", text: "Banner 1" },
  { id: 2, bg: "#893AF6", text: "Banner 2" },
  { id: 3, bg: "#45B7D1", text: "Banner 3" },
];
function RouteComponent() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 更新当前选中索引
  const updateIndex = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // 监听轮播切换事件
  useEffect(() => {
    if (!emblaApi) return () => {};
    emblaApi.on("select", updateIndex);
    return () => emblaApi.off("select", updateIndex);
  }, [emblaApi, updateIndex]);

  // 初始化时设置正确索引
  useEffect(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  return (
    <div className="flex flex-auto flex-col items-center px-[14px] py-[12px] gap-[16px]">
      {/* banner */}
      <div className="relative">
        <div
          className="w-[347px] h-[220px] rounded-[15px] bg-[#3C3C3C] overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex h-full">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="embla__slide flex-[0_0_100%] min-w-0 h-full flex items-center justify-center"
                style={{ backgroundColor: slide.bg }}
              >
                <span className="text-white text-[24px]">{slide.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 圆形指示器 */}
        <div className="flex gap-[2px] absolute bottom-[16px] left-1/2 -translate-x-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-[5px] h-[5px] rounded-full transition-all ${
                index === selectedIndex
                  ? "w-[7px] bg-white rounded-[35px]"
                  : "bg-[#D8D8D8] bg-opacity-60"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`跳转到第 ${index + 1} 张幻灯片`}
            />
          ))}
        </div>
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
            <li key={i} className="flex flex-col gap-[6px]">
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
