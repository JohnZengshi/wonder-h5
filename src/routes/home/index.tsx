import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, ErrorBlock, Swiper, Image, NoticeBar } from "antd-mobile";
import { useState } from "react";
import tuiguangzhuanqiang from "@/assets/tuiguangzhuanqiang.svg";
import lianxikefu from "@/assets/lianxikefu.svg";
import guangwangrukou from "@/assets/guangwangrukou.svg";
import statusUp from "@/assets/status-up.svg";
import { BaseBtn } from "@/components/BaseBtn";
import gif_1 from "@/assets/AI/1.gif";
import gif_2 from "@/assets/AI/2.gif";
import gif_3 from "@/assets/AI/3.gif";
import gif_4 from "@/assets/AI/4.gif";
import clsx from "clsx";
import { css } from "@/lib/emotion";

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
      {banner?.length ? (
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
      ) : null}

      {/* 公告 */}
      {/* <div className="w-full flex items-center gap-[14px] px-[14px] h-[54px] rounded-[10px] bg-[#1F1F1F]">
        <span className="i-hugeicons-volume-high text-[#9795E9] text-[24px]"></span>
        <span className="text-[14px]">{notice?.noticeTitle}</span>
      </div> */}
      <NoticeBar
        className={clsx(
          "w-full flex items-center gap-[14px] !px-[14px] !h-[54px] !rounded-[10px] !bg-[#1F1F1F] !border-none",
          css`
            .adm-notice-bar-left {
              color: #9795e9;
            }
            .adm-notice-bar-content-inner {
              font-size: 14px !important;
            }
          `
        )}
        content={notice?.noticeTitle}
      />

      <div
        className="w-[347px] h-[200px] rounded-[10px] "
        onClick={() => {
          navigate({ to: "/product", search: { goodsId: menberPackage?.id } });
        }}
      >
        <Image src={menberPackage?.commodityImg} />
      </div>

      <ul className="w-full h-[108px] flex gap-[10px]">
        {[
          {
            title: "推广赚钱",
            icon: tuiguangzhuanqiang,
            borderColor: "#FFEDFE",
            shadowColor: "rgba(255, 237, 254, 0.6)",
          },
          {
            title: "联系客服",
            icon: lianxikefu,
            borderColor: "#F9E3BA",
            shadowColor: "rgba(249, 227, 186, 0.6)",
          },
          {
            title: "官网入口",
            icon: guangwangrukou,
            borderColor: "#FFFFFF",
            shadowColor: "rgba(255, 162, 229, 0.6)",
          },
          {
            title: "官网入口",
            icon: statusUp,
            borderColor: "#C7FFBA",
            shadowColor: "rgba(199, 255, 186, 0.6)",
          },
        ].map((v, i) => (
          <li
            key={i}
            className="rounded-[10px] flex-1 h-full flex flex-col items-center justify-center gap-[10px] bg-[#1F1F1F] relative"
          >
            <BaseBtn
              className="w-[56px] h-[56px]"
              borderColor={v.borderColor}
              shadowColor={v.shadowColor}
            >
              <img src={v.icon} alt="" />
            </BaseBtn>
            <span className="text-[14px] whitespace-nowrap">{v.title}</span>
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

  const [goodsList, setGoodsList] =
    useState<components["schemas"]["Commodity对象"][]>();

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

    setGoodsList(data?.data?.records as any);
  }, []);

  return (
    <>
      {goodsList?.length ? (
        <ul className="w-full pt-[13px] pb-[27px] gap-[8px] grid grid-cols-2">
          {goodsList?.map((v, i) => (
            <li
              key={i}
              className="w-[172px] max-w-[172px] h-[226px] flex flex-col gap-[6px] bg-[#1F1F1F] rounded-[10px]"
              onClick={() => {
                navigate({ to: "/product", search: { goodsId: v.id } });
              }}
            >
              <div className="w-full h-[172px] rounded-[12px] p-[11px]">
                {v.type == 4 ? (
                  <>
                    {v.machineConfigLevel == 1 && (
                      <img src={gif_1} className="w-full h-full" alt="" />
                    )}
                    {v.machineConfigLevel == 2 && (
                      <img src={gif_2} className="w-full h-full" alt="" />
                    )}
                    {v.machineConfigLevel == 3 && (
                      <img src={gif_3} className="w-full h-full" alt="" />
                    )}
                    {v.machineConfigLevel == 4 && (
                      <img src={gif_4} className="w-full h-full" alt="" />
                    )}
                  </>
                ) : (
                  <>
                    <Image
                      src={v.commodityImg}
                      className="w-full h-full"
                      alt=""
                    />
                  </>
                )}
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
