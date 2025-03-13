import { PopupTitle } from "@/components/PopupTitle";
import { css } from "@/lib/emotion";
import { showPaymentPassword } from "@/utils/payment";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Button,
  Image,
  NavBar,
  NumberKeyboard,
  PasscodeInput,
  PasscodeInputRef,
  Popup,
  SafeArea,
  Stepper,
  SwipeAction,
} from "antd-mobile";
import { useMemo, useRef, useState } from "react";
import gouwuchekong from "@/assets/gouwuchekong.svg";
import useStore from "@/store/useStore";
import { useAsyncEffect } from "ahooks";
import FetchClient from "@/server";
import { components } from "@/server/api";
import { BaseBtn } from "@/components/BaseBtn";

export const Route = createFileRoute("/cart")({
  component: RouteComponent,
});

const btnBg = css`
  border-radius: 136px;
  opacity: 1;
  background: linear-gradient(180deg, #893af6 0%, #511b7c 100%);
`;

function RouteComponent() {
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);
  const [entryPwVisble, setEntryPwVisble] = useState(false);
  const passcodeInputRef = useRef<PasscodeInputRef>(null);
  const [password, setPassword] = useState("");
  const {
    cart,
    updateQuantity,
    toggleItemSelection,
    toggleSelectAll,
    removeFromCart,
  } = useStore();
  const [recommended, setRecommended] =
    useState<components["schemas"]["Commodity对象"][]>();

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/frontPage/pageCommodity", {
      params: {
        query: { type: 3, pageNum: 1, pageSize: 99 },
      },
    });
    setRecommended(data?.data?.records);
  }, []);

  // 使用useMemo计算购物车总价
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      // 只计算被选中商品的总价
      if (!item.selected) return total;
      return total + parseFloat(item.info.prices || "0") * item.quantity;
    }, 0);
  }, [cart]);

  return (
    <div className="flex flex-col relative">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => window.history.back()}
      >
        <span className="text-[18px]">购物车</span>
      </NavBar>
      <div className="flex flex-col flex-auto p-[14px] relative">
        <ul className="bg-[#1F1F1F] rounded-[10px] px-[14px] py-[13px] flex flex-col gap-[24px]">
          {cart.length ? (
            <>
              {cart.map((v, i) => (
                <SwipeAction
                  className="flex flex-col gap-[8px] !bg-transparent"
                  key={i}
                  rightActions={[
                    {
                      key: "delete",
                      text: "删除",
                      color: "danger",
                      onClick: () => v.info.id && removeFromCart(v.info.id),
                    },
                  ]}
                >
                  <div
                    className="flex items-center gap-[10px]"
                    onClick={() => {
                      if (v.info.id) toggleItemSelection(v.info.id);
                    }}
                  >
                    <div>
                      {v.selected ? (
                        <span className="i-mdi-check-circle text-[18px] text-[#9795E9]"></span>
                      ) : (
                        <>
                          <span className="block w-[16px] h-[16px] border-[1px] border-[#666666] rounded-[50%]"></span>
                        </>
                      )}
                    </div>
                    <div className="w-[74px] h-[74px] min-w-[74px] rounded-[9.37px] ">
                      <Image src={v.info.commodityImg} />
                    </div>
                    <div className="flex-auto self-start flex flex-col gap-[3.75px]">
                      <span className="text-ellipsis line-clamp-2 text-[14px] text-white">
                        {v.info.commodityName}
                      </span>
                      <span className="text-ellipsis line-clamp-2 text-[12px] text-[#999999]">
                        {v.info.commodityTrait}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-[8px]">
                    <div className="w-[19px] min-w-[19x]"></div>
                    <div className="w-[74px] min-w-[74px]"></div>
                    <div className="flex-auto flex justify-between items-center">
                      <span className="text-[14px]">${v.info.prices}</span>
                      <Stepper
                        min={1}
                        defaultValue={v.quantity}
                        onChange={(value) => {
                          console.log(value);
                          if (v.info.id) updateQuantity(v.info.id, value);
                        }}
                      />
                    </div>
                  </div>
                </SwipeAction>
              ))}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <img
                  src={gouwuchekong}
                  className="w-[120px] h-[147px]"
                  alt=""
                />
                <span className="text-[14px] mt-[16px] mb-[28px]">
                  您的购物车暂时没有商品
                </span>
                <BaseBtn
                  title="去购物"
                  className="px-[69px] h-[44px] rounded-[22px]"
                />
              </div>
            </>
          )}
        </ul>
        <span className="text-[18px] mt-[42px] mb-[10px]">推荐</span>
        <ul className="flex flex-wrap justify-between gap-[16px]">
          {recommended?.map((v, i) => (
            <li
              className="p-[10px] h-[213px] flex flex-col justify-between bg-[#1F1F1F] rounded-[10px]"
              key={i}
              onClick={() => {
                navigate({ to: "/product", search: { goodsId: v.id } });
              }}
            >
              <div className="w-[145px] h-[164px] rounded-[12.75px] ">
                <Image src={v.commodityImg} />
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-[12px]">{v.commodityName}</span>
                <span className="text-[18px]">
                  <span className="text-[#9E9E9E] text-[10.62px]">$ </span>
                  {v.prices}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="h-[56px]"></div>
        <SafeArea position="bottom" />

        <div className="w-full fixed bottom-0 left-0 bg-[#191919]">
          <div className="flex items-center gap-[7px] px-[14px] h-[56px]">
            <div
              className="flex items-center gap-[7px]"
              onClick={() => toggleSelectAll()}
            >
              {cart.every((v) => v.selected) ? (
                <span className="i-mdi-check-circle text-[18px] text-[#9795E9]"></span>
              ) : (
                <>
                  <span className="block w-[16px] h-[16px] border-[1px] border-[#666666] rounded-[50%]"></span>
                </>
              )}
              <span className="text-[16px]">全选</span>
            </div>
            <div
              className="flex items-center ml-auto"
              onClick={() => setVisible(true)}
            >
              <span className="text-[12px]">总计：</span>
              <span className="text-[16px] text-[#9795E9]">${totalPrice}</span>
            </div>
            {/* <button
            className={`w-[125px] h-[44px] ml-[20px] flex items-center justify-center ${btnBg}`}
            onClick={async () => {}}
          >
            <span className="text-[16px] font-[600]">
              结算
              {cart.filter((v) => v.selected).length > 0
                ? `（${cart.filter((v) => v.selected).length}）`
                : ""}
            </span>
          </button> */}
            <BaseBtn
              className="px-[25px] py-[11px] !rounded-[22px] "
              title={`结算${
                cart.filter((v) => v.selected).length > 0
                  ? `（${cart.filter((v) => v.selected).length}）`
                  : ""
              }`}
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
            ></BaseBtn>
          </div>
          <SafeArea position="bottom" />
        </div>

        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false);
          }}
          onClose={() => {
            setVisible(false);
          }}
        >
          <div className="rounded-t-[18px] p-[14px] flex flex-col pb-[254px]">
            <div className="flex items-center justify-between">
              <span className="text-[18px]">金额明细</span>
              <span className="i-mdi-close-circle text-[22px] text-[#3D3D3D]"></span>
            </div>
            <ul className="flex gap-[20px] flex-wrap mt-[25px]">
              {Array.from({ length: 5 }).map((v, i) => (
                <li
                  className="relative w-[69px] h-[69px] rounded-[10px] bg-[#3C3C3C]"
                  key={i}
                >
                  <span className="i-mdi-check-circle text-[#893AF6] text-[12px] absolute right-[7px] top-[8px]"></span>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-[10px] mt-[22px]">
              {[
                { label: "商品总价", value: "$999" },
                { label: "平台代币", value: "899/个" },
                { label: "平台积分", value: "$100" },
              ].map((v, i) => (
                <li className="flex items-center justify-between" key={i}>
                  <span className="text-[14px] ">{v.label}</span>
                  <span className="text-[14px]">{v.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Popup>

        {/* <Popup
        visible={entryPwVisble}
        onMaskClick={() => setEntryPwVisble(false)}
      >
        <PopupTitle title="支付密码" onClick={() => setEntryPwVisble(false)} />
        <div className="flex flex-col items-center pb-[25px]">
          <span className="text-[56px] flex items-center font-[500] gap-[6px] mt-[49px]">
            {" "}
            <span className="text-[12px]">$</span> 999
          </span>
          <PasscodeInput
            ref={passcodeInputRef}
            seperated
            className="mt-[31px]"
            value={password}
            onChange={(value) => setPassword(value)}
            keyboard={
              <NumberKeyboard
                visible={entryPwVisble}
                confirmText={"确认"}
                onConfirm={() => setEntryPwVisble(false)}
              />
            }
          />
          {entryPwVisble ? <div className="w-full h-[240px]"></div> : null}

          <SafeArea position="bottom" />
        </div>
      </Popup> */}
      </div>
    </div>
  );
}
