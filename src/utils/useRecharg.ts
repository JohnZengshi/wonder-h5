import {
  payByContract,
  usePollingCheckBuyStatus,
} from "@/contract/contractService";
import { tronTestnet } from "@/network";
import FetchClient from "@/server";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { useRouter } from "@tanstack/react-router";
import { Toast } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import { BaseError, parseUnits } from "viem";
import { bsc, bscTestnet, tron } from "viem/chains";

export type ChainType = 1 | 2; // 1 bsc 2 trx
/**
 * 充值hook
 * @param param0
 * @returns
 */
function useRecharg({ successCallback }: { successCallback?: () => void }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const isConnectedRef = useRef(isConnected);
  const addressRef = useRef(address);
  const [paying, setPaying] = useState(false);
  const { disconnect } = useDisconnect();
  const { navigate } = useRouter();
  const { transcationStatus, startPollingCheckBuyStatus } =
    usePollingCheckBuyStatus();

  useEffect(() => {
    isConnectedRef.current = isConnected;
    addressRef.current = address;
  }, [isConnected, address]);

  useEffect(() => {
    if (transcationStatus == "success") {
      setPaying(false);
      Toast.show("充值成功");
      disconnect();
      successCallback?.();
    }
  }, [transcationStatus]);

  /**
   * 充值
   */
  async function recharg(chainType: ChainType, payAmount: string) {
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
    const { data } = await FetchClient.POST("/api/user-wallet/topUp", {
      params: {
        query: {
          amount: payAmount,
          coinId: chainType,
          paymentAddress: addressRef.current,
          type: 2,
        },
      },
    });
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
      var _error = error as BaseError;
      setPaying(false);
      console.log(_error);
      disconnect();
      Toast.show(_error.details ?? _error.shortMessage ?? _error.message);
    }
  }

  return {
    recharg,
    // payAmount,
    // setPayAmount,
    // chainType,
    // setChainType,
    paying,
  };
}

export default useRecharg;
