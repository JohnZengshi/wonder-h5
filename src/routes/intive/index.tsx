import { css } from "@/lib/emotion";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button, NavBar, Popup, SafeArea, Toast } from "antd-mobile";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import CustomIcon from "@/components/CustomIcon";
import { useAsyncEffect } from "ahooks";
import { components } from "@/server/api";
import FetchClient from "@/server";
import { downloadImage } from "@/utils";

export const Route = createFileRoute("/intive/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef<HTMLImageElement>(null);
  const [userInfo, setUserInfo] =
    useState<components["schemas"]["UserRecommender"]>();

  // 生成邀请链接的二维码（示例链接，请替换为实际邀请链接）
  const generateQR = async (link: string) => {
    try {
      const url = await QRCode.toDataURL(link, {
        width: 230,
        margin: 0,
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("生成二维码失败:", err);
    }
  };
  useEffect(() => {}, []);

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/account/recommender", {
      params: { query: { pageNum: 1, pageSize: 10 } },
    });
    setUserInfo(data?.data?.user);
    const inviteLink = `${import.meta.env.VITE_APP_BASE_URL}?inviteCode=${data?.data?.user?.shareCode}`;

    generateQR(inviteLink);
  }, []);

  // 保存二维码处理函数
  const handleSave = async () => {
    if (!qrCodeRef.current) return;

    try {
      const imageSrc = qrCodeRef.current.src;

      // 兼容iOS/Android的保存方案
      if (navigator.share) {
        // 使用Web Share API（现代浏览器）
        const response = await fetch(imageSrc);
        const file = await response.blob();
        await navigator.share({
          files: [new File([file], "qrcode.png", { type: "image/png" })],
          title: "保存二维码",
        });
      } else {
        // 传统下载方式
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = imageSrc;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 提示（需要引入Toast组件）
      Toast.show("二维码已保存");
    } catch (err) {
      Toast.show("保存失败，请长按二维码手动保存");
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh]">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => window.history.back()}
      >
        <span className="text-[18px]">推荐好友</span>
      </NavBar>
      <div className="flex flex-col px-[14px] items-center">
        <div className="w-full flex items-center justify-center gap-[20px] mt-[9px]">
          {[
            {
              icon: <span className="i-mdi-invite"></span>,
              title: "直推人数",
              num: userInfo?.shareNum ?? 0,
            },
            {
              icon: <span className="i-mdi-people-group-outline"></span>,
              title: "团队人数",
              num: userInfo?.teamNum ?? 0,
            },
          ].map((v, i) => (
            <div
              className={clsx(
                "flex flex-auto items-center h-[70px] px-[13px] justify-between",
                css`
                  border-radius: 10px;
                  opacity: 1;
                  background: rgba(252, 252, 252, 0.1);
                  box-sizing: border-box;
                  border: 0.5px solid;
                  border-image: linear-gradient(
                      129deg,
                      #9795e9 1%,
                      rgba(252, 252, 252, 0.13) 21%,
                      rgba(255, 162, 229, 0.1) 112%
                    )
                    0.5;
                  backdrop-filter: blur(60px);
                `
              )}
              key={i}
              onClick={() => {
                navigate({ to: "/intive/invite-list" });
              }}
            >
              <div className="flex flex-col gap-[5px]">
                <span className="text-[12px] text-[#999999]">{v.title}</span>
                <span className="text-[16px] font-bold">{v.num}</span>
              </div>
              <div className="text-[36px] text-[#9795E9] flex items-center justify-center">
                {v.icon}
              </div>
            </div>
          ))}
        </div>

        <span className="text-[24px] mt-[19px]">
          分享链接，邀请好友来WEB4X赚取积分
        </span>
        <span className="text-[12px] text-[#666666] mt-[9px]">
          这里是一段小字这里是一段小字这里是一段小字这里是一段小字这里是一段小字
        </span>

        <div
          className="w-[230px] h-[230px] bg-white mt-[44px] p-[10px] rounded-[10px]"
          onClick={async () => {
            try {
              await downloadImage(qrCodeUrl, "intive_qr");
              Toast.show("保存成功");
            } catch (err) {
              Toast.show("保存失败");
              console.error("保存二维码失败:", err);
            }
          }}
        >
          <img src={qrCodeUrl} alt="邀请二维码" ref={qrCodeRef} />
        </div>

        <span className="text-[16px] mt-[16px]">点击二维码保存到手机</span>
        <div
          className={clsx(
            "flex items-center px-[13.5px] h-[44px] w-full mt-[26px]",
            css`
              border-radius: 10px;
              opacity: 1;
              background: rgba(0, 0, 0, 0.2);
              box-sizing: border-box;
              border: 1px solid #ffa2e5;
              box-shadow:
                inset 1.73px 1.73px 12.94px 0px rgba(255, 62, 201, 0.3),
                inset -1.73px -1.73px 12.94px 0px rgba(255, 62, 201, 0.3);
            `
          )}
        >
          <span className="text-[12px]">邀请码</span>
          <span className="text-[16px] text-[#999999] ml-auto mr-[16px]">
            {" "}
            {userInfo?.shareCode ?? ""}
          </span>
          <span
            className="text-[24px] i-hugeicons-copy-01 text-[#FFA2E5]"
            onClick={async () => {
              try {
                if (userInfo?.shareCode) {
                  await navigator.clipboard.writeText(userInfo.shareCode);
                  Toast.show("已复制邀请码");
                }
              } catch (err) {
                Toast.show("复制失败，请手动选择复制");
              }
            }}
          ></span>
        </div>

        <div className="flex items-center gap-[16px] my-[26px]">
          <span className="block flex-auto h-[1px] bg-[#666666]"></span>
          <span className="text-[12px] text-[#666666]">
            也可以通过以下方式邀请
          </span>
          <span className="block flex-auto h-[1px] bg-[#666666]"></span>
        </div>

        <ul className="flex items-center justify-between w-full px-[46px]">
          {[
            { title: "链接", icon: <i className="i-hugeicons-link-01" /> },
            { title: "微信", icon: <i className="i-hugeicons-wechat" /> },
            { title: "X", icon: <i className="i-hugeicons-twitter" /> },
            { title: "TG", icon: <i className="i-hugeicons-telegram" /> },
          ].map((v, i) => (
            <li className="flex flex-col items-center gap-[4px]" key={i}>
              <CustomIcon icon={v.icon} />
              <span className="text-[12px]">{v.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
