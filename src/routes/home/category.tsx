import { css } from "@/lib/emotion";
import { createFileRoute } from "@tanstack/react-router";
import { SideBar } from "antd-mobile";

export const Route = createFileRoute("/home/category")({
  component: RouteComponent,
});

export const tabs = [
  {
    key: "key1",
    title: "分类1",
  },
  {
    key: "key2",
    title: "分类2",
  },
  {
    key: "key3",
    title: "分类3",
  },
];

function RouteComponent() {
  return (
    <div className="flex flex-auto justify-center">
      <div className="flex w-full gap-[26px] pt-[20px]">
        <SideBar className="w-[62px] min-w-[62px]">
          {tabs.map((item) => (
            <SideBar.Item
              key={item.key}
              title={item.title}
              className={css`
                .adm-side-bar-item-title {
                  font-size: 14px;
                  font-weight: normal;
                  line-height: normal;
                  letter-spacing: 0em;
                  font-variation-settings: "opsz" auto;
                }
              `}
            />
          ))}
        </SideBar>
        <div className="flex-auto pr-[14px]">
          <ul className="w-full flex flex-col gap-[14px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <li className="w-full bg-[#1F1F1F] rounded-[10px] px-[20px] flex flex-col gap-[20px] pt-[6px] pb-[20px]">
                <span className="text-[14px] font-[500]">分类1名称</span>
                <ul className="flex flex-wrap gap-[14px] justify-between">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <li className="flex flex-col items-center gap-[4px]">
                      <div className="w-[56px] h-[56px] rounded-[10px] bg-[#3C3C3C]"></div>
                      <span className="text-[12px]">名称</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
