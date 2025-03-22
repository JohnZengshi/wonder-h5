import { BaseBtn } from "@/components/BaseBtn";
import { css } from "@/lib/emotion";
import FetchClient from "@/server";
import { ChainType } from "@/utils/useRecharg";
import { createFileRoute } from "@tanstack/react-router";
import {
  ImageUploader,
  ImageUploadItem,
  Input,
  NavBar,
  TextArea,
  Toast,
} from "antd-mobile";
import clsx from "clsx";
import { useState } from "react";

type params = {
  coinId: ChainType;
};
export const Route = createFileRoute("/wallet-details/replenishmentOrder")({
  component: RouteComponent,
  validateSearch: (search: params): params => ({
    coinId: search.coinId,
  }),
});

function RouteComponent() {
  const [fileList, setFileList] = useState<ImageUploadItem[]>();
  const [imgUrl, setImgUrl] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const { coinId } = Route.useSearch();
  const [paymentAddress, setPaymentAddress] = useState("");

  async function upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("filename", file.name); // 添加文件名参数

    const { data } = await FetchClient.POST("/api/file/upload", {
      body: formData as any,
    });

    setImgUrl(data?.data?.fullUrl);
    return {
      url: URL.createObjectURL(file),
    };
  }
  return (
    <div className="flex flex-col relative min-h-[100vh] bg-[#141414] pb-[12px] items-center">
      <NavBar
        className="!h-[44px] w-full bg-transparent"
        onBack={() => window.history.back()}
      >
        充值
      </NavBar>
      <div className="flex flex-col items-center gap-[16px]  px-[14px]">
        <div className="flex flex-col gap-[8px] w-full">
          <span className="text-[#999999] text-[14px]">付款地址</span>
          <TextArea
            className="min-h-[65px] rounded-[10px] border-[#4B525C] border px-[17px] py-[8px]"
            value={paymentAddress}
            onChange={setPaymentAddress}
          />
        </div>

        <div className="flex flex-col gap-[8px] w-full">
          <span className="text-[#999999] text-[14px]">付款金额</span>
          <div className="flex items-center h-[44px] rounded-[10px] px-[18px] border-[#4B525C] border">
            <Input
              type="number"
              className="flex-auto"
              value={amount}
              onChange={setAmount}
            />
            <span className="text-[16px] text-[#999999]">USDT</span>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] w-full">
          <span className="text-[#999999] text-[14px]">上传订单截图</span>
          <ImageUploader
            maxCount={1}
            style={{ "--cell-size": "104px" }}
            className={clsx(css`
              .adm-image-uploader-upload-button {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed rgba(255, 255, 255, 0.2);
              }
            `)}
            value={fileList}
            onChange={setFileList}
            upload={upload}
          />
          <span className="text-[14px] text-[#999999]">只支持.jpg 格式</span>
        </div>
        <div
          className={css`
            font-family: Alibaba PuHuiTi 2;
            font-size: 12px;
            font-weight: normal;
            line-height: normal;
            text-transform: uppercase;
            letter-spacing: normal;
            color: #999999;
          `}
        >
          <p>
            1、请勿向上述地址充值任何非BSC网络的USDT币种，否则资产将不可找回。
            USDT，小于最小金额的充值金额将不会上账且无法退回。
          </p>
          <p>
            2、您充值至上述地址后，需要整个网络节点的确认，网络确认后才到账。
          </p>
          <p>3、最小充值金额为：10</p>
          <p>
            4、你的充值地址不会经常改变，可以重复充值。如有更改我们会尽量通过网站公告或邮件通知您。
          </p>
          <p>5、务必确认电脑及浏览器安全，防止信息被篡改或泄漏。</p>
          <p>6、请不要将 NFT 发送到该地址。</p>
          <p>
            7、不支持通过智能合约充值，不要通过ERC20、
            ARBITRUM与OPTIMISM网络充值USDT。
          </p>
        </div>
        <BaseBtn
          title="提交订单"
          className="w-[314px] h-[44px] mt-[44px] rounded-[22px]"
          borderColor="#9795E9"
          shadowColor="rgba(255, 62, 201, 0.3)"
          onClick={async () => {
            console.log("depositImg:", imgUrl);
            await FetchClient.POST("/api/user-wallet/topUp", {
              params: {
                query: {
                  amount,
                  coinId,
                  paymentAddress,
                  type: 1,
                  depositImg: imgUrl,
                },
              },
            });
            Toast.show("提交成功，等待审核");
            window.history.back();
          }}
        />
      </div>
    </div>
  );
}
