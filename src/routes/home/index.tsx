import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, ErrorBlock, Swiper, Image } from "antd-mobile";
import { useState } from "react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [banner, setBanner] = useState<components["schemas"]["Banner对象"][]>();
  const [notice, setNotice] = useState<components["schemas"]["Notice对象"]>();
  const [zoneList, setZoneList] =
    useState<components["schemas"]["CommodityType"][]>();
  const [menberPackage, setMenberPackage] =
    useState<components["schemas"]["Commodity对象"]>();

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/banner");
    setBanner(data?.data);
  }, []);
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/common/notice/list");
    setNotice(data?.data?.records?.[0]);
  }, []);
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET(
      "/api/frontPage/findCommodityTypeOrMember"
    );
    setZoneList(data?.data?.commodityTypeList);
    setMenberPackage(data?.data?.member ?? undefined);
  }, []);

  return (
    <div className="flex flex-auto flex-col items-center px-[14px] py-[12px] gap-[16px]">
      {/* banner */}
      <div className="relative w-[347px] rounded-[15px] overflow-hidden">
        <Swiper autoplay>
          {banner?.map((v, i) => (
            <Swiper.Item key={i}>
              <div
                className="h-[220px] flex items-center justify-center"
                onClick={() => {}}
              >
                <Image className="w-full h-full" src={v.imageUrl} alt="" />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* 公告 */}
      <div className="w-full flex items-center gap-[14px] px-[14px] h-[54px] rounded-[10px] bg-[#1F1F1F]">
        <span className="i-hugeicons-volume-high text-[#9795E9] text-[24px]"></span>
        <span className="text-[14px]">
          {/* 这里是很长很长的一句话可以滚动的公告内容 */}
          {notice?.noticeTitle}
        </span>
      </div>

      <div
        className="w-[347px] h-[200px] rounded-[10px] bg-[#1F1F1F]"
        onClick={() => {
          navigate({ to: "/product", search: { goodsId: menberPackage?.id } });
        }}
      >
        <Image src={menberPackage?.commodityImg} />
      </div>

      <ul className="w-full h-[108px] flex gap-[10px]">
        {[
          { title: "推广赚钱" },
          { title: "联系客服" },
          { title: "官网入口" },
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

      {zoneList?.map((v, i) => (
        <div className="w-full rounded-[10px]" key={i}>
          <div className="py-[16px]">
            <span className="ml-[14px] text-[18px] font-bold">
              {v.typeName}
            </span>
          </div>
          <ZoneGoodsList commodityTypeId={v.id} />
        </div>
      ))}
    </div>
  );
}

function ZoneGoodsList({ commodityTypeId }: { commodityTypeId: number }) {
  const { navigate } = useRouter();

  const [goodsList, setGoodsList] = useState<components["schemas"]["Page"]>();

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/frontPage/pageCommodity", {
      params: {
        query: {
          commodityTypeId: commodityTypeId,
          pageNum: 1,
          pageSize: 99,
        },
      },
    });

    setGoodsList(data?.data);
  }, []);

  return (
    <>
      {goodsList?.records?.length ? (
        <ul className="w-full pt-[13px] pb-[27px] gap-[8px] grid grid-cols-2">
          {goodsList?.records?.map((v, i) => (
            <li
              key={i}
              className="w-[172px] max-w-[172px] h-[226px] flex flex-col gap-[6px] bg-[#1F1F1F]"
              onClick={() => {
                navigate({ to: "/product", search: { goodsId: v.id } });
              }}
            >
              <div className="w-full h-[172px] rounded-[12px] p-[11px]">
                <Image src={v.commodityImg} className="w-full h-full" alt="" />
              </div>
              <div className="flex flex-col items-start px-[12px] pb-[8px] overflow-hidden">
                <span className="text-[14px] text-ellipsis whitespace-nowrap w-full overflow-hidden">
                  {v.commodityName}
                </span>
                <span className="text-[18px] text-[#F5222D]">
                  <span className="text-[12px] text-[#F5222D]">$ </span>
                  {v.prices}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </>
  );
}
