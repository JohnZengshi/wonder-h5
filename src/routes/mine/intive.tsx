import { css } from "@/lib/emotion";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button, NavBar, Popup, SafeArea, Toast } from "antd-mobile";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { PopupTitle } from "@/components/PopupTitle";

export const Route = createFileRoute("/mine/intive")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  const [visible, setVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef<HTMLImageElement>(null);
  // 生成邀请链接的二维码（示例链接，请替换为实际邀请链接）
  const inviteLink = "https://your-domain.com/invite?code=USER123";

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(inviteLink, {
          width: 230,
          margin: 0,
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("生成二维码失败:", err);
      }
    };

    generateQR();
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
        onBack={() => navigate({ to: ".." })}
      >
        <span className="text-[18px]">推荐好友</span>
      </NavBar>
      <div className="flex flex-col px-[14px]">
        <div className="w-full flex items-center justify-center gap-[121px] mt-[42px]">
          {[
            {
              icon: <span className="i-mdi-invite"></span>,
              title: "直推人数",
              num: 100,
            },
            {
              icon: <span className="i-mdi-people-group-outline"></span>,
              title: "团队人数",
              num: 68,
            },
          ].map((v, i) => (
            <div className="flex flex-col items-center" key={i}>
              <div className="text-[24px] text-[#A1A1A1] flex items-center justify-center">
                {v.icon}
              </div>
              <span className="text-[10px] mt-[2px]">{v.title}</span>
              <span className="text-[24px] mt-[5px] leading-[34px] font-bold text-[#893AF6]">
                {v.num}
              </span>
            </div>
          ))}
        </div>

        <div className="p-[17px] rounded-[10px] bg-[#1F1F1F] flex flex-col gap-[12px] mt-[23px]">
          {[
            {
              title: "邀请码",
              content: (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[16px] text-[#893AF6]">T2DF4H</span>
                    <span className="i-lucide-copy text-[24px] text-[#893AF6]"></span>
                  </div>
                </>
              ),
            },
            {
              title: "邀请链接",
              content: (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[16px] text-[#893AF6]">
                      https://wonder.iighue=T2DF4H
                    </span>
                    <span className="i-lucide-copy text-[24px] text-[#893AF6]"></span>
                  </div>
                </>
              ),
            },
            {
              title: "二维码邀请",
              content: (
                <>
                  <div className="flex items-center justify-center w-full">
                    <span className="text-[14px] text-[#893AF6]">
                      点击生成图片
                    </span>
                  </div>
                </>
              ),
              onClick: () => setVisible(true),
            },
          ].map((v, i) => (
            <div
              className="flex flex-col gap-[6px]"
              onClick={v.onClick}
              key={i}
            >
              <span className="text-[12px]">{v.title}</span>
              <div className="rounded-[10px] border-[#511B7C] border h-[44px] px-[14px] flex items-center">
                {v.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <span className="text-[18px] my-[16px]">直推列表</span>
          <div className="rounded-[10px] border border-[#511B7C] overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="h-[37px] border-b border-[#511B7C]">
                  <th className="text-[12px] font-normal text-center">ID</th>
                  <th className="text-[12px] font-normal text-center">时间</th>
                  <th className="text-[12px] font-normal text-center">状态</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((item, index) => (
                  <tr
                    key={index}
                    className="h-[37px] border-b border-[#511B7C] last:border-b-0"
                  >
                    <td className="text-[10px] text-center text-[#999999]">
                      #12345
                    </td>
                    <td className="text-[10px] text-center text-[#999999]">
                      2023-09-01 12:00
                    </td>
                    <td className="text-[10px] text-center text-[#8639EF]">
                      成功
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Popup visible={visible} onMaskClick={() => setVisible(!visible)}>
        <PopupTitle title="邀请码" onClick={() => setVisible(false)} />

        <div className="flex flex-col items-center px-[28px] pb-[28px]">
          <div className="w-[230px] h-[230px] bg-white mt-[44px] p-[10px] rounded-[10px]">
            <img src={qrCodeUrl} alt="邀请二维码" ref={qrCodeRef} />
          </div>
          <Button
            block
            className={clsx(
              "h-[44px] !mt-[44px]",
              css`
                border-radius: 10px;
                opacity: 1;
                background:
                  linear-gradient(180deg, #893af6 0%, #511b7c 100%), #1f1f1f;
              `
            )}
            fill="none"
            onClick={handleSave}
          >
            <span className="text-[16px]">保存到手机</span>
          </Button>
          <SafeArea position="bottom" />
        </div>
      </Popup>
    </div>
  );
}
