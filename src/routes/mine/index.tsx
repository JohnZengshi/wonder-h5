import { css } from "@/lib/emotion";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button, NavBar, SafeArea } from "antd-mobile";
import logo from "@/assets/logo.svg";
import jifeng from "@/assets/jifeng.svg";
import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

export const Route = createFileRoute("/mine/")({
  component: RouteComponent,
});

const btn = css`
  font-size: 16px;
  color: white;
  height: 44px;
  border-radius: 10px;
  opacity: 1;
`;

function RouteComponent() {
  const { navigate } = useRouter();
  return (
    <div className="flex flex-col relative min-h-[100vh]">
      <div
        className={css`
          position: absolute;
          left: 0px;
          top: 0px;
          width: 375px;
          height: 241px;
          opacity: 1;
          background: linear-gradient(
            180deg,
            #893af6 0%,
            rgba(81, 27, 124, 0) 100%
          );
        `}
      ></div>
      <NavBar
        className="relative z-50 !h-[44px]"
        onBack={() => {
          navigate({ to: ".." });
        }}
      ></NavBar>
      <div className="flex-auto w-full flex flex-col gap-[16px] px-[14px] mt-[42px] z-50 pb-[14px]">
        <div className="flex items-center gap-[9px]">
          <div className="w-[62px] h-[62px] rounded-[50%] bg-white"></div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[16px] text-white">名称名称</span>
              <span className="text-[16px] text-[#4EFC27]">LV1</span>
              <span className="i-mdi-award text-[24px] text-[#8639EF]"></span>
            </div>
            <span className="text-[14px] flex items-center gap-[4px]">
              ID账号：123456789{" "}
              <span className="i-mdi-copyleft text-[14px]"></span>{" "}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[12px]">
          <div className="rounded-[10px] bg-[#1F1F1F] px-[14px]">
            <div className="flex items-center justify-between pt-[16px]">
              <span className="text-[18px]">资产</span>
              <span className="i-mdi-eye-off-outline text-[20px] text-[#8639EF]"></span>
            </div>
            <ul className="flex flex-col gap-[]">
              {[
                // { title: "平台代币", value: "$899", icon: logo },
                { title: "平台积分", value: "$100", icon: jifeng },
              ].map((v) => (
                <li className="h-[50px] flex items-center justify-between border-b-[#A7A9AC] border-opacity-15">
                  <div className="flex items-center gap-[6px]">
                    <img className="w-[24px] h-[24px]" src={v.icon} alt="" />
                    <span className="text-[14px]">{v.title}</span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[14px]">{v.value}</span>
                    <span className="i-mdi-chevron-right text-[20px] text-[#666666]"></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-[12px]">
            <Button
              block
              color="primary"
              className={clsx(
                btn,
                css`
                  background: linear-gradient(0deg, #511b7c, #511b7c), #1f1f1f;
                `
              )}
              fill="none"
            >
              提币
            </Button>
            <Button
              block
              color="primary"
              className={clsx(
                btn,
                css`
                  background:
                    linear-gradient(180deg, #893af6 0%, #511b7c 100%), #1f1f1f;
                `
              )}
              fill="none"
            >
              转账
            </Button>
          </div>
          <LabelWrap>
            <LabelItem
              label="平台代币地址"
              showArrow={false}
              icon={<span className="i-mdi-coin-outline" />}
            />
            <div className="flex items-center justify-between pb-[16px] px-[17px]">
              <span className="text-[16px] text-[#893AF6]">
                0xuhdiabfidaskjnaskjdvnjk
              </span>
              <span className="i-lucide-copy text-[#893AF6] text-[22px]"></span>
            </div>
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              label="推荐好友"
              icon={<span className="i-mdi-invite" />}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              showLine
              label="我的订单"
              showArrow={false}
              icon={<span className="i-mdi-order-numeric-ascending" />}
            />
            <LabelItem
              label="我的卡密"
              showArrow={false}
              icon={<span className="i-mdi-password-outline" />}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              label="安全中心"
              icon={<span className="i-mdi-safety-goggles" />}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              showLine
              label="平台介绍"
              showArrow={false}
              icon={<span className="i-mdi-list-box-outline" />}
            />
            <LabelItem
              label="帮助"
              showArrow={false}
              icon={<span className="i-mdi-help" />}
            />
          </LabelWrap>
        </div>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}

function LabelWrap({ children }: PropsWithChildren) {
  return <div className="rounded-[10px] bg-[#1F1F1F] ">{children}</div>;
}

function LabelItem({
  showLine,
  label,
  showArrow = true,
  icon,
}: {
  showLine?: boolean;
  label: string;
  showArrow?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-[13px] px-[17px]">
      <div
        className={clsx(
          css`
            font-size: 24px;
            color: #8639ef;
          `,
          "flex items-center"
        )}
      >
        {icon}
      </div>
      <div
        className={clsx(
          "flex-auto flex items-center justify-between h-[50px]",
          showLine
            ? "border-b-[#A7A9AC] border-b-[0.5px] border-opacity-15"
            : ""
        )}
      >
        <span className="text-[14px]">{label}</span>
        {showArrow ? (
          <span className="i-mdi-chevron-right text-[24px] ml-auto text-[#A7A9AC]"></span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
