import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Empty, NavBar, SafeArea, Toast } from "antd-mobile";
import { useAsyncEffect } from "ahooks";
import clsx from "clsx";
import { css } from "@/lib/emotion";
import { BaseBtn } from "@/components/BaseBtn";
import { showTransferModal } from "@/utils/transfer";
import useStore from "@/store/useStore";
import FetchClient from "@/server";
import { useState } from "react";
import { showWithdrawModal } from "@/utils/withdraw";
import { showPaymentPassword } from "@/utils/payment";
import { Md5 } from "ts-md5";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { payByContract } from "@/contract/contractService";
import { bytesToBigInt, numberToBytes, parseUnits, weiUnits } from "viem";

export type coindType = { type: "points" | "token" };
export const Route = createFileRoute("/wallet-details/")({
  validateSearch: (search: Record<string, unknown>): coindType => {
    if (!search.type || !["points", "token"].includes(search.type as string))
      throw new Error("Invalid asset type");
    return { type: search.type as "points" | "token" };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { type } = Route.useSearch();
  const { navigate } = useRouter();
  const { userInfo } = useStore();
  const [rechargeAddress, setRechargeAddress] = useState<string>("");
  const [logData, setLogData] = useState<any[]>([]);
  const { open, close } = useAppKit();
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();
  // 加载钱包数据
  useAsyncEffect(async () => {
    const { data } = await FetchClient.GET("/api/user-wallet/rechargeAddress", {
      params: { query: { coinId: type == "points" ? 1 : 2 } },
    });
    var address = data?.data?.address ?? "";
    setRechargeAddress(address);
    const { data: logDAta } = await FetchClient.GET(
      "/api/user-wallet-log/page",
      {
        params: {
          query: {
            pageNum: 1,
            pageSize: 999,
            walletId: type == "points" ? 1 : 2,
          },
        },
      }
    );
    setLogData(logDAta?.data?.records ?? []);
  }, [type]);

  return (
    <div className="flex flex-col relative min-h-[100vh] bg-[#141414] pb-[12px]">
      <NavBar
        className="!h-[44px] bg-transparent"
        onBack={() => window.history.back()}
      >
        {type === "points" ? "平台积分" : "平台代币"}
      </NavBar>

      <div className="flex flex-col px-[14px]">
        <span className="text-[14px] text-[#999]">
          {type === "points" ? "平台积分" : "平台代币"}
        </span>
        <span className="text-[14px] flex items-center gap-[6px]">
          <span className="text-[38px] font-bold">
            {type == "points"
              ? (userInfo.userWallets?.find((v) => v.coinId == 1)?.balance ?? 0)
              : (userInfo.userWallets?.find((v) => v.coinId == 2)?.balance ??
                0)}
          </span>
          $
        </span>

        <ul className="flex items-center gap-[16.5px] mt-[7px]">
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="充值"
            icon={<span className="i-hugeicons-download-01 text-[24px]"></span>}
            onClick={async () => {
              navigate({
                to: "/wallet-details/recharge",
                search: { type: type },
              });
            }}
          />
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="提币"
            icon={<span className="i-hugeicons-upload-01 text-[24px]"></span>}
            onClick={() => {
              showWithdrawModal({
                onConfirm: (chain: number, address: string, amount: number) => {
                  showPaymentPassword({
                    amount: amount,
                    async onConfirm(password) {
                      await FetchClient.POST("/api/user-wallet/withdrawCoins", {
                        body: {
                          amount: amount.toString(),
                          chain: chain,
                          coinId: type == "points" ? 1 : 2,
                          paymentPassword: Md5.hashStr(password),
                          toAddress: address,
                        },
                      });
                    },
                  });
                },
              });
            }}
          />
          <BaseBtn
            className="w-[105px] h-[44px]"
            title="转账"
            icon={<span className="i-hugeicons-exchange-01 text-[24px]"></span>}
            onClick={() => {
              showTransferModal({
                onConfirm: (address, amount) => {
                  showPaymentPassword({
                    amount: amount,
                    async onConfirm(password) {
                      await FetchClient.POST("/api/user-wallet/transfer", {
                        body: {
                          amount: amount.toString(),
                          address: address,
                          coinId: type == "points" ? 1 : 2,
                          password: Md5.hashStr(password),
                        },
                      });
                    },
                  });
                },
              });
            }}
          />
        </ul>
        <div className="rounded-[10px] bg-[#1F1F1F] px-[17px] py-[11px] flex flex-col gap-[17px] mt-[18px]">
          <div className="flex items-center gap-[12px]">
            <span className="text-[24px] text-[#9795E9] i-hugeicons-coins-01"></span>
            <span className="text-[14px]">
              {type === "points" ? "平台积分地址" : "平台代币地址"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-[#9795E9] text-ellipsis overflow-hidden whitespace-nowrap">
              {rechargeAddress}
            </span>
            <span
              className="i-hugeicons-copy-01 text-[24px] text-[#9795E9]"
              onClick={async () => {
                try {
                  if (userInfo?.shareCode) {
                    await navigator.clipboard.writeText(rechargeAddress);
                    Toast.show("复制成功");
                  }
                } catch (err) {
                  Toast.show("复制失败，请手动选择复制");
                }
              }}
            ></span>
          </div>
        </div>

        <span className="text-[18px] mt-[16px] mb-[10px]">代币日志</span>

        <ul className="bg-[#1F1F1F] rounded-[10px]">
          {logData.map((v, index) => (
            <li
              key={index}
              className="flex items-center justify-between px-[8px] py-[16px]"
            >
              <div className="flex flex-col gap-[4px]">
                <span className="text-[14px]">audhiudhfoasofnak</span>
                <span className="text-[10px] text-[#666666]">
                  2025.3.15 23:52
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[14px] text-[#9795E9]">+999</span>
                <span className="text-[10px] text-[#9795E9]">接收</span>
              </div>
            </li>
          ))}
          {logData.length == 0 && (
            <div className="min-h-[50vh] flex items-center justify-center">
              <Empty />
            </div>
          )}
        </ul>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
