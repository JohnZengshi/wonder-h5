import { css } from "@/lib/emotion";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Empty, NavBar, Swiper, SwiperRef, Tabs } from "antd-mobile";
import clsx from "clsx";
import { useRef, useState } from "react";

export const Route = createFileRoute("/order")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const tabItems = [
    { key: "1", title: "全部" },
    { key: "2", title: "已完成" },
    { key: "3", title: "确认中" },
    { key: "4", title: "已取消" },
  ];

  return (
    <div className="flex flex-col">
      <NavBar onBack={() => window.history.back()}>
        <span className="text-[18px]">我的订单</span>
      </NavBar>
      <Tabs
        activeKey={tabItems[activeIndex]?.key}
        onChange={(key) => {
          const index = tabItems.findIndex((item) => item.key === key);
          setActiveIndex(index);
          swiperRef.current?.swipeTo(index);
        }}
        className={clsx(
          "px-[14px]",
          css`
            .adm-tabs-header {
              border-bottom: 0.5px solid #a7a9ac15;
              .adm-tabs-tab-wrapper {
                padding: 0;
                .adm-tabs-tab {
                  height: 44px;
                  width: 100%;
                  text-align: center;
                  &.adm-tabs-tab-active {
                    background: #883af63e;
                  }
                }
              }
            }
          `
        )}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      <Swiper
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => {
          setActiveIndex(index);
        }}
      >
        <Swiper.Item>
          <OrderList />
        </Swiper.Item>
        <Swiper.Item>
          <OrderList />
        </Swiper.Item>
        <Swiper.Item>
          <OrderList />
        </Swiper.Item>
        <Swiper.Item>
          <OrderList />
        </Swiper.Item>
      </Swiper>
    </div>
  );
}

function OrderList() {
  return (
    <div className="px-[14px] py-[21px]">
      <ul className="flex flex-col gap-[21px]">
        {Array.from({ length: 20 }).map((v, i) => (
          <li className="flex items-center gap-[10px] h-[74px]">
            <div className="w-[74px] min-w-[74px] h-[74px] rounded-[9.37px] bg-[#3C3C3C]"></div>
            <div className="flex flex-col gap-[3.75px]">
              <span className="text-[14px] text-ellipsis line-clamp-2">
                名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称名称
              </span>
              <span className="text-[12px] text-[#999999]">商品信息</span>
            </div>
            <div className="flex flex-col ml-auto items-end">
              <span className="text-[16.87px] ">$999</span>
              <span className="text-[10px] text-[#999999]">x1</span>
              {i % 2 == 0 ? (
                <span className="text-[16.87px] text-[#893AF6] mt-auto text-nowrap">
                  已完成
                </span>
              ) : (
                <span className="text-[16.87px] text-[#EA0000] mt-auto text-nowrap">
                  已取消
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
