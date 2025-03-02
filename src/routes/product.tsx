import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button, NavBar, SafeArea, Stepper, Swiper } from "antd-mobile";
import peoductExample from "@/assets/product-example.png";
import clsx from "clsx";
import { css } from "@/lib/emotion";
import { useEffect } from "react";
import { showPaymentPassword } from "@/utils/payment";

export const Route = createFileRoute("/product")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // 空依赖数组表示只执行一次
  const { navigate } = useRouter();
  return (
    <div className="flex flex-col min-h-[100vh]">
      <NavBar onBack={() => navigate({ to: ".." })}></NavBar>
      <div className="flex flex-col flex-auto relative">
        <Swiper>
          {Array.from({ length: 4 }).map((v) => (
            <Swiper.Item>
              <div className="h-[296px] w-full flex items-start justify-center">
                <img
                  src={peoductExample}
                  className="w-[247px] h-[247px]"
                  alt=""
                />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
        <div
          className={clsx(
            css`
              border-radius: 18px 18px 0px 0px;
              opacity: 1;
              background: #1f1f1f;
            `,
            "flex-auto mt-[17px] px-[14px] py-[28px] flex flex-col"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[22px]">商品名称</span>
            <span className="text-[28px] text-[#893AF6] font-bold flex items-center gap-[4px]">
              <span className="text-[12px] text-white font-bold">$</span>
              999
            </span>
          </div>
          <span
            className={clsx(
              "text-[12px] text-[#909090] leading-normal mt-[11px]",
              css`
                letter-spacing: 0px;
                font-variation-settings: "opsz" auto;
                color: #909090;
                font-weight: 250;
              `
            )}
          >
            这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍这里是商品介绍
          </span>

          <div className="flex items-center justify-between mt-[20px]">
            <span className="text-[16px]">购买数量/张</span>
            <Stepper
              defaultValue={1}
              onChange={(value) => {
                console.log(value);
              }}
            />
          </div>

          <span className="text-[16px] mt-[24px]">套餐包</span>
          <ul className="bg-[#141414] px-[14px] py-[11px] rounded-[10px] flex items-center gap-[10px] overflow-x-auto mt-[8px]">
            {Array.from({ length: 10 }).map((v) => (
              <li className="w-[56px] min-w-[56px] h-[56px] rounded-[10px] bg-[#3C3C3C]"></li>
            ))}
          </ul>

          <div className="w-full h-[500px] bg-[#3C3C3C] rounded-[10px] mt-[28px]"></div>
        </div>
        <div className="h-[62px]"></div>
        <SafeArea position="bottom" />
        <div className="flex flex-col fixed  bottom-0 left-0 bg-[#191919] w-full">
          <div className="h-[62px] flex items-center px-[14px] gap-[29px]">
            <Button
              block
              color="primary"
              className={clsx(
                Styles.btn,
                css`
                  background: linear-gradient(0deg, #511b7c, #511b7c), #1f1f1f;
                `
              )}
              fill="none"
            >
              <span>加入购物车</span>
            </Button>
            <Button
              block
              color="primary"
              className={clsx(
                Styles.btn,
                css`
                  background:
                    linear-gradient(180deg, #893af6 0%, #511b7c 100%), #1f1f1f;
                `
              )}
              fill="none"
              onClick={async () => {
                const password = await new Promise<string>(
                  (resolve, reject) => {
                    showPaymentPassword({
                      amount: 999,
                      onConfirm: resolve,
                      onCancel: () => reject("cancel"),
                    });
                  }
                );
              }}
            >
              <span>立即购买</span>
            </Button>
          </div>
          <SafeArea position="bottom" />
        </div>
      </div>
    </div>
  );
}

const Styles = {
  btn: css`
    font-size: 16px;
    color: white;
    height: 44px;
    border-radius: 84px;
    opacity: 1;
  `,
};
