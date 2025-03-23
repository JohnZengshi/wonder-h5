import { css } from "@/lib/emotion";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button, Modal, NavBar, SafeArea, Toast, Image } from "antd-mobile";
import clsx from "clsx";
import { PropsWithChildren, ReactNode, useState } from "react";
import { useAsyncEffect } from "ahooks";
import FetchClient from "@/server";
import { components } from "@/server/api";
import CustomIcon from "@/components/CustomIcon";
import { showChangePassword } from "@/utils/password";
import { Md5 } from "ts-md5";
import useStore from "@/store/useStore";
import { downloadImage } from "@/utils";
import defaultUserIcon from "@/assets/defaultUserIcon.svg";

export const Route = createFileRoute("/home/mine")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [qrVisible, setQrVisible] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const { userInfo } = useStore();

  const { setUserInfo } = useStore();
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/account/findUser");
    if (data?.data) setUserInfo(data?.data);
  }, []);
  return (
    <div className="flex flex-col relative min-h-[100vh]">
      <div className="flex-auto w-full flex flex-col gap-[16px] px-[14px] mt-[42px] z-50 pb-[14px]">
        <div className="flex items-center gap-[9px]">
          <img
            className="w-[62px] h-[62px] rounded-[50%] bg-white"
            src={defaultUserIcon}
            alt=""
          />
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[16px] text-white">
                {userInfo?.userName}
              </span>
              <span className="text-[16px] text-[#4EFC27]">
                LV{userInfo?.level}
              </span>
              <span className="i-mdi-award text-[24px] text-[#9795E9]"></span>
            </div>
            <span className="text-[14px] flex items-center gap-[4px] text-[#999999]">
              ID账号：<span className="text-[#E9E9E9]">{userInfo?.uid} </span>
              <span className="i-hugeicons-copy-01 text-[14px] text-[#E9E9E9]"></span>{" "}
            </span>
          </div>
          <button
            className="text-[12px] text-[#000000] bg-[#9795E9] px-[10px] py-[8px] rounded-[10px]"
            onClick={async () => {
              const { data } = await FetchClient.GET(
                "/api/account/findUserNameOrPassword"
              );
              if (data?.data?.base64Img) {
                setQrImage(data.data.base64Img);
                setQrVisible(true);
              } else {
                Toast.show("生成二维码失败");
              }
            }}
          >
            生成登录二维码
          </button>
        </div>

        <ul className="flex items-center justify-between">
          {[
            {
              key: "2",
              title: "平台代币($)",
              value: `$ ${userInfo?.userWallets?.find((v) => v.coinId == 2)?.balance ?? 0}`,
            },
            {
              key: "1",
              title: "平台积分($)",
              value: `$ ${userInfo?.userWallets?.find((v) => v.coinId == 1)?.balance ?? 0}`,
            },
          ].map((v, i) => (
            <li
              key={i}
              className={clsx(
                css`
                  width: 168px;
                  height: 70px;
                  opacity: 1;
                  box-sizing: border-box;
                  border: 0.5px solid;
                  border-image: linear-gradient(
                      128deg,
                      #9795e9 1%,
                      rgba(252, 252, 252, 0.13) 21%,
                      rgba(255, 162, 229, 0.1) 111%
                    )
                    0.5;
                `,
                "px-[13px] py-[13px] flex flex-col items-start justify-center gap-[5px]"
              )}
              onClick={() => {
                navigate({
                  to: "/wallet-details",
                  search: { type: v.key === "1" ? "points" : "token" },
                });
              }}
            >
              <span className="text-[12px] text-[#999999]">{v.title}</span>
              <span className="text-[16px] font-bold">{v.value}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-[12px]">
          <LabelWrap>
            <LabelItem
              label="推荐好友"
              icon={<span className="i-mdi-invite" />}
              onClick={() => navigate({ to: "/intive" })}
              iconStyle={{
                borderColor: "#FFFBDD",
                shadowColor: "rgba(255, 251, 221, 0.6)",
              }}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              showLine
              label="我的购物车"
              showArrow={false}
              icon={<span className="i-hugeicons-shopping-cart-01" />}
              onClick={() => navigate({ to: "/cart" })}
              iconStyle={{
                borderColor: "#FFEDFE",
                shadowColor: "rgba(255, 237, 254, 0.6)",
              }}
            />
            <LabelItem
              label="我的卡密"
              showArrow={false}
              icon={<span className="i-hugeicons-password-validation" />}
              onClick={() => navigate({ to: "/card-secrets" })}
              iconStyle={{
                borderColor: "#F9E3BA",
                shadowColor: "rgba(249, 227, 186, 0.6)",
              }}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              label="语言设置"
              icon={<span className="i-hugeicons-language-circle" />}
              iconStyle={{
                borderColor: "#BFE4EC",
                shadowColor: "rgba(191, 228, 236, 0.6);",
              }}
            />
            <LabelItem
              label="安全中心"
              icon={<span className="i-hugeicons-security" />}
              iconStyle={{
                borderColor: "#FFFFFF",
                shadowColor: "rgba(255, 162, 229, 0.6)",
              }}
              onClick={() => {
                let oldPassword = "";
                let newPassword = "";
                showChangePassword({
                  isFirst: false,
                  async onConfirmNew(value) {
                    newPassword = value;
                    console.log(oldPassword, newPassword);
                    await FetchClient.POST("/api/account/renewPasswordPay", {
                      body: {
                        fromPassword: Md5.hashStr(oldPassword),
                        toPassword: Md5.hashStr(newPassword),
                      },
                    });
                    Toast.show("修改成功");
                  },
                  onConfirmOld(value) {
                    oldPassword = value;
                  },
                });
              }}
            />
          </LabelWrap>
          <LabelWrap>
            <LabelItem
              showLine
              label="平台介绍"
              showArrow={false}
              icon={<span className="i-hugeicons-list-setting" />}
              iconStyle={{
                borderColor: "#C7FFBA",
                shadowColor: "rgba(199, 255, 186, 0.6)",
              }}
            />
            <LabelItem
              label="帮助"
              showArrow={false}
              icon={<span className="i-hugeicons-help-circle" />}
              iconStyle={{
                borderColor: "#9795E9",
                shadowColor: "rgba(158, 165, 235, 0.6)",
              }}
            />
          </LabelWrap>
        </div>
      </div>
      <SafeArea position="bottom" />
      <Modal
        visible={qrVisible}
        title={<span className="text-white">登录二维码</span>}
        content={
          <div className="flex justify-center p-4 bg-black">
            <Image
              src={qrImage}
              className="w-[200px] h-[200px]"
              alt="登录二维码"
            />
          </div>
        }
        closeOnMaskClick
        closeOnAction
        onClose={() => setQrVisible(false)}
        actions={[
          {
            key: "save",
            text: "保存",
            className: "text-white bg-[#9795E9]",
            async onClick() {
              try {
                await downloadImage(qrImage, "login_qr");
                Toast.show("保存成功");
              } catch (err) {
                Toast.show("保存失败");
                console.error("保存二维码失败:", err);
              }
            },
          },
        ]}
        bodyClassName="bg-[#191919]"
      />
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
  onClick,
  iconStyle,
}: {
  showLine?: boolean;
  label: string;
  showArrow?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  iconStyle?: {
    borderColor?: string;
    shadowColor?: string;
  };
}) {
  return (
    <div className="flex items-center gap-[13px] px-[17px]" onClick={onClick}>
      <CustomIcon icon={icon} iconStyle={iconStyle} />
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
