import { css } from "@/lib/emotion";
import FetchClient from "@/server";
import { components } from "@/server/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { Empty, SideBar } from "antd-mobile";
import clsx from "clsx";
import { useState } from "react";

export const Route = createFileRoute("/home/category")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selected, setSelected] = useState<number>();
  const [zoneList, setZoneList] =
    useState<components["schemas"]["CommodityType"][]>();
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET(
      "/api/frontPage/findCommodityTypeOrMember"
    );
    setZoneList(data?.data?.commodityTypeList);
    setSelected(data?.data?.commodityTypeList?.[0]?.id);
  }, []);
  return (
    <div className="flex flex-auto justify-center">
      <div className="flex w-full gap-[26px] pt-[20px]">
        <SideBar
          className="w-[82px] min-w-[82px]"
          onChange={(id) => setSelected(parseInt(id))}
          activeKey={selected?.toString()}
        >
          {zoneList?.map((item) => (
            <SideBar.Item
              key={item.id}
              title={item.typeName}
              className={clsx(css`
                .adm-side-bar-item-title {
                  font-size: 14px;
                  font-weight: normal;
                  line-height: normal;
                  letter-spacing: 0em;
                  font-variation-settings: "opsz" auto;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                }
              `)}
            />
          ))}
        </SideBar>
        <div className="flex-auto pr-[14px]">
          {selected ? <GoodsList categoryId={selected} /> : <></>}
        </div>
      </div>
    </div>
  );
}

function GoodsList({ categoryId }: { categoryId: number }) {
  const { navigate } = useRouter();
  const [goodsList, setGoodsList] =
    useState<components["schemas"]["Commodity"][]>();
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/frontPage/pageCommodity", {
      params: {
        query: {
          commodityTypeId: categoryId,
          pageNum: 1,
          pageSize: 99,
        },
      },
    });
    setGoodsList(data?.data?.records);
  }, [categoryId]);
  return (
    <ul className="w-full flex flex-col gap-[14px]">
      {Array.from({ length: 1 }).map((_, i) => (
        <li
          className="w-full bg-[#1F1F1F] rounded-[10px] px-[20px] flex flex-col gap-[20px] py-[20px]"
          key={i}
        >
          {/* <span className="text-[14px] font-[500]">分类1名称</span> */}
          <ul className="flex flex-wrap gap-[14px] justify-between">
            {goodsList?.length ? (
              <>
                {goodsList?.map((v, i) => (
                  <li
                    className="flex flex-col items-center gap-[4px]"
                    key={i}
                    onClick={() => {
                      navigate({ to: "/product", search: { goodsId: v.id } });
                    }}
                  >
                    <div className="w-[56px] h-[56px] rounded-[10px] bg-[#3C3C3C]"></div>
                    <span className="text-[12px]">{v.commodityName}</span>
                  </li>
                ))}
              </>
            ) : (
              <Empty className="w-full" />
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
}
