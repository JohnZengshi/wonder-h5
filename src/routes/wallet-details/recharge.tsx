import { BaseBtn } from "@/components/BaseBtn";
import {
  payByContract,
  usePollingCheckBuyStatus,
} from "@/contract/contractService";
import { css } from "@/lib/emotion";
import { showNetworkModal } from "@/utils/network";
import { createFileRoute, Router, useRouter } from "@tanstack/react-router";
import { Input, NavBar, SafeArea, Toast } from "antd-mobile";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { coindType } from ".";
import { useAsyncEffect } from "ahooks";
import FetchClient from "@/server";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { parseUnits } from "viem";
import { bsc, bscTestnet, tron } from "viem/chains";
import { tronTestnet } from "@/network";

export const Route = createFileRoute("/wallet-details/recharge")({
  component: RouteComponent,
  validateSearch: (search: coindType): coindType => search,
});

function RouteComponent() {
  const { open, close } = useAppKit();
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();
  const { type } = Route.useSearch();
  const { navigate } = useRouter();
  const [chainType, setChainType] = useState<1 | 2>(1);
  const [rechargeAddress, setRechargeAddress] = useState<string>("");
  const isConnectedRef = useRef(isConnected);
  const addressRef = useRef(address);
  const [payAmount, setPayAmount] = useState<string>("10");

  const { transcationStatus, startPollingCheckBuyStatus } =
    usePollingCheckBuyStatus();

  const [paying, setPaying] = useState(false);
  useEffect(() => {
    isConnectedRef.current = isConnected;
    addressRef.current = address;
  }, [isConnected, address]);

  useEffect(() => {
    if (transcationStatus == "success") {
      var chainTypeStr = import.meta.env.DEV
        ? chainType == 1
          ? bscTestnet.name
          : tronTestnet.name
        : chainType == 1
          ? bsc.name
          : tron.name;
      setPaying(false);
      Toast.show("充值成功");
      navigate({
        to: "/wallet-details/rechargeSuccess",
        search: {
          anmout: payAmount,
          chainType: chainTypeStr,
        },
      });
    }
  }, [transcationStatus, payAmount]);

  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/user-wallet/rechargeAddress", {
      params: { query: { coinId: type == "points" ? 1 : 2 } },
    });
    var address = data?.data?.address ?? "";
    setRechargeAddress(address);
  });
  return (
    <div className="flex flex-col relative min-h-[100vh] bg-[#141414] pb-[80px]">
      <NavBar
        className="!h-[44px] bg-transparent"
        onBack={() => window.history.back()}
        right={
          <i
            className="i-hugeicons-catalogue text-[24px]"
            onClick={() => {
              navigate({ to: "/wallet-details/rechargeLog" });
            }}
          />
        }
      >
        充值
      </NavBar>
      <div className="flex flex-col px-[14px] items-center">
        <div className="w-[180px] h-[180px] bg-[#666666] rounded-[10px] mt-[18px]"></div>
        <span className="text-[14px] text-[#666666] mt-[6px]">
          该地址仅支持充值TRC20的USDT
        </span>
        <div
          className={clsx(
            "px-[17px] py-[11px] h-[94px] flex flex-col justify-between mt-[8px] w-full",
            css`
              border-radius: 10px;
              background: #1f1f1f;
              box-sizing: border-box;
              border: 1px solid #9795e9;
              /* 主色描边 */
              box-shadow:
                inset 1.73px 1.73px 12.96px 0px rgba(255, 62, 201, 0.3),
                inset -1.73px -1.73px 12.96px 0px rgba(255, 62, 201, 0.3);
            `
          )}
        >
          <span className="text-[14px] text-[#999999]">地址</span>
          <div className="flex items-start gap-[25px] justify-between w-full">
            <span className="text-[16px] break-all">{rechargeAddress}</span>
            <i
              className="i-hugeicons-copy-01 text-[#9795E9] text-[24px]"
              onClick={async () => {
                try {
                  if (rechargeAddress) {
                    await navigator.clipboard.writeText(rechargeAddress);
                    Toast.show("复制成功");
                  }
                } catch (err) {
                  Toast.show("复制失败，请手动选择复制");
                }
              }}
            ></i>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] w-full mt-[16px]">
          <span className="text-[#999999] text-[14px]">付款金额</span>
          <div className="flex items-center h-[44px] rounded-[10px] px-[18px] border-[#4B525C] border">
            <Input
              type="number"
              min={10}
              className="flex-auto"
              value={payAmount}
              onChange={setPayAmount}
            />
            <span className="text-[16px] text-[#999999]">USDT</span>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] w-full mt-[16px]">
          <span className="text-[14px] text-[#999999]">网络</span>
          <div
            className={clsx(
              "h-[44px] px-[17px] py-[11px] flex items-center justify-between",
              css`
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.2);
                box-sizing: border-box;
                border: 1px solid #91faff;
                /* 辅助色描边 */
                box-shadow:
                  inset 1.73px 1.73px 12.96px 0px rgba(145, 250, 255, 0.3),
                  inset -1.73px -1.73px 12.96px 0px rgba(145, 250, 255, 0.3);
              `
            )}
            onClick={() => {
              showNetworkModal({
                default: chainType == 1 ? "BSC" : "TRON",
                onConfirm: (network) => {
                  // 处理网络选择逻辑
                  console.log("Selected network:", network);
                  setChainType(network == "BSC" ? 1 : 2);
                },
              });
            }}
          >
            <span className="text-[16px]">
              {chainType == 1 ? "BSC" : "TRX"}
            </span>
            <i className="i-hugeicons-arrow-down-01 text-[24px]"></i>
          </div>
          <ul
            className={clsx(
              "flex flex-col gap-[4px] mt-[4px] w-full",
              css`
                li {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  > span {
                    &:first-of-type {
                      font-family: Alibaba PuHuiTi 2;
                      font-size: 14px;
                      font-weight: normal;
                      line-height: normal;
                      letter-spacing: normal;
                      color: #999999;
                    }
                    &:last-of-type {
                      font-family: Alibaba PuHuiTi 2;
                      font-size: 14px;
                      font-weight: normal;
                      line-height: normal;
                      letter-spacing: normal;
                      color: #ffffff;
                    }
                  }
                }
              `
            )}
          >
            <li>
              <span>最小充值数量</span>
              <span>10 USDT</span>
            </li>
            <li>
              <span>区块确认数</span>
              <span>4次确认</span>
            </li>
          </ul>
        </div>
        <div
          className={clsx(
            "flex flex-col mt-[16px]",
            css`
              font-family: Alibaba PuHuiTi 2;
              font-size: 12px;
              font-weight: normal;
              line-height: normal;
              text-transform: uppercase;
              letter-spacing: normal;
              color: #999999;
            `
          )}
        >
          <p>
            1、请勿向上述地址充值任何非BSC网络的USDT币种，否则资产将不可找回。
          </p>
          <p>
            2、您充值至上述地址后，需要整个网络节点的确认，网络确认后才到账。
          </p>
          <p>
            3、最小充值金额为：10
            USDT，小于最小金额的充值金额将不会上账且无法退回。
          </p>
          <p>
            4、你的充值地址不会经常改变，可以重复充值。如有更改我们会尽量通过网站公告或邮件通知您。
          </p>
          <p>5、务必确认电脑及浏览器安全，防止信息被篡改或泄漏。</p>
          <p>6、请不要将 NFT 发送到该地址。</p>
          <p>7、不支持通过智能合约充值，不要通过ERC20、</p>
          <p>ARBITRUM与OPTIMISM网络充值USDT。</p>
        </div>
      </div>
      <SafeArea position="bottom" />
      <div className="flex flex-col px-[13px] py-[17px] fixed bottom-0 left-0 w-full">
        <div className="flex items-center gap-[18px] w-full">
          <BaseBtn
            title="补充订单"
            className="flex-1 h-[44px]"
            borderColor="#91FAFF"
            shadowColor="rgba(145, 250, 255, 0.3)"
            onClick={() => {
              navigate({
                to: "/wallet-details/replenishmentOrder",
                search: { coinId: chainType },
              });
            }}
          />
          <BaseBtn
            disabled={paying}
            loading={paying}
            title="立即充值"
            className="flex-1 h-[44px]"
            borderColor="#FFA2E5"
            shadowColor="rgba(255, 62, 201, 0.3)"
            onClick={async () => {
              if (!isConnected) {
                await open();
                // 等待钱包连接状态更新

                // 使用ref获取最新状态 + 添加超时机制
                await new Promise((resolve, reject) => {
                  const startTime = Date.now();
                  const check = () => {
                    if (isConnectedRef.current) {
                      resolve(true);
                    } else if (Date.now() - startTime > 30000) {
                      // 30秒超时
                      reject(new Error("连接超时"));
                    } else {
                      setTimeout(check, 100);
                    }
                  };
                  check();
                }).catch(() => {
                  Toast.show("连接超时，请重试");
                  throw new Error("用户取消连接");
                });
              }
              console.log("钱包已连接");
              const { data } = await FetchClient.POST(
                "/api/user-wallet/topUp",
                {
                  params: {
                    query: {
                      amount: payAmount.toString(),
                      coinId: chainType,
                      paymentAddress: addressRef.current,
                      type: 2,
                    },
                  },
                }
              );
              var order = data?.data?.orderNumber;
              var amount = data?.data?.amount;
              if (!order) return;
              const amountWei = parseUnits(Number(amount).toFixed(18), 18);
              try {
                setPaying(true);
                var res = await payByContract(
                  amountWei,
                  order,
                  chainType == 1 ? "bsc" : "tron"
                );
                startPollingCheckBuyStatus(res);
              } catch (error) {
                setPaying(false);
                Toast.show("充值失败");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
