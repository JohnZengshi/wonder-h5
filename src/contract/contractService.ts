/*
 * @LastEditors: John
 * @Date: 2024-06-19 15:48:57
 * @LastEditTime: 2024-07-19 14:09:28
 * @Author: John
 */
import {
  readContract,
  estimateGas,
  writeContract,
  waitForTransactionReceipt,
  getAccount,
  switchChain,
  getChainId,
  getClient,
} from "@wagmi/core";
import { encodeFunctionData } from "viem/utils";
import bscUsdtAbi from "@/contract/bsc_usdt.json";
import tronUsdtAbi from "@/contract/tron_usdt.json";
import bscBusinessAbi from "@/contract/bsc_pay.json";
import tronBusinessAbi from "@/contract/tron.json";

import { BaseError } from "wagmi";
import { wagmiAdapter } from "@/AppKitProvider";
import { bsc, bscTestnet, tron } from "viem/chains";
import { addChain } from "viem/actions";
import { Chain, createWalletClient, custom } from "viem";
/*
 * @LastEditors: John
 * @Date: 2024-06-21 16:08:23
 * @LastEditTime: 2024-06-21 16:12:31
 * @Author: John
 */
import { useRef, useState } from "react";
import { tronTestnet } from "@/network";

const config = wagmiAdapter.wagmiConfig;

// 新增链配置类型
type ChainConfig = {
  usdt: {
    abi: any;
    address: `0x${string}`;
  };
  business: {
    abi: any;
    address: `0x${string}`;
  };
};

var bscId;
var tronId;
if (import.meta.env.MODE == "production") {
  bscId = bsc.id;
  tronId = tron.id;
} else {
  bscId = bscTestnet.id;
  tronId = tronTestnet.id;
}
const CHAIN_CONFIG: Record<number, ChainConfig> = {
  // BSC 链配置（示例ID，请替换实际链ID）
  [bscId]: {
    usdt: {
      abi: bscUsdtAbi,
      address: import.meta.env.VITE_BSC_USDT_ADDRESS,
    },
    business: {
      abi: bscBusinessAbi,
      address: import.meta.env.VITE_BSC_BUSINESS_ADDRESS,
    },
  },
  [tronId]: {
    usdt: {
      abi: tronUsdtAbi,
      address: import.meta.env.VITE_TRON_USDT_ADDRESS,
    },
    business: {
      abi: tronBusinessAbi,
      address: import.meta.env.VITE_TRON_BUSINESS_ADDRESS,
    },
  },
};
// 获取当前链配置
async function getChainConfig(): Promise<ChainConfig> {
  // const chainId = getAccount(config).chain?.id;

  let chainId = getChainId(config);
  // console.log("当前链ID：", chainId);
  // console.log("USDT合约地址：", CHAIN_CONFIG[chainId]?.usdt.address); // 新增调试日志
  // console.log("业务合约地址：", CHAIN_CONFIG[chainId]?.business.address);

  if (!chainId || !CHAIN_CONFIG[chainId]) {
    // throw new Error("Unsupported chain");
    try {
      await switchChain(config, { chainId: bsc.id });
      chainId = bsc.id;
    } catch (err) {
      console.log("switch chain error", err);
      throw new Error("请手动切换至BSC网络");
    }
  }
  return CHAIN_CONFIG[chainId]!;
}

/**
 * @description 获取代币余额
 * @param {string} fromAddress
 */

export const getBalance = async (): Promise<bigint> => {
  const currentConfig = await getChainConfig();
  return new Promise((reslove, reject) => {
    const fromAddress = getAccount(config).address;
    if (!fromAddress) return reject(new Error("address is emtiy"));
    readContract(config, {
      abi: currentConfig.usdt.abi,
      address: currentConfig.usdt.address,
      functionName: "balanceOf",
      args: [fromAddress],
    })
      .then((res: any) => {
        console.log("U余额:", res);
        if (typeof res == "undefined") {
          // 获取授权U失败
          reject(new BaseError("get balance of usdt error!"));
          return;
        }
        reslove(res);
      })
      .catch((err: BaseError) => {
        console.log("get balance of usdt err", err);
        reject(err);
      });
  });
};

/**
 * @description: 获取已经授权的U
 * @param {string} fromAddress
 */
export const getApproveUsdt = async (): Promise<bigint> => {
  const currentConfig = await getChainConfig();
  return new Promise((reslove, reject) => {
    const fromAddress = getAccount(config).address;
    if (!fromAddress) return reject(new Error("address is emtiy"));

    readContract(config, {
      abi: currentConfig.usdt.abi,
      address: currentConfig.usdt.address,
      functionName: "allowance",
      args: [fromAddress, currentConfig.business.address],
    })
      .then((res: any) => {
        console.log("上次授权的U:", res);
        if (typeof res == "undefined") {
          // 获取授权U失败
          reject(new BaseError("get approve usdt error"));
          return;
        }
        reslove(res);
      })
      .catch((err: BaseError) => {
        console.log("get approve usdt error", err);
        reject(err);
      });
  });
};

/**
 * @description: 授权U
 * @param {bigint} uNum
 */
export const authorizedU = async (uNum: bigint) => {
  const currentConfig = await getChainConfig();
  console.log("授权金额参数：", currentConfig.usdt.address, uNum);
  return new Promise<void>((reslove, reject) => {
    estimateGas(config, {
      to: currentConfig.usdt.address,
      data: encodeFunctionData({
        abi: currentConfig.usdt.abi,
        functionName: "approve",
        args: [currentConfig.business.address, uNum],
      }),
    })
      .then((gas) => {
        const gasPrice = (gas * 12n) / 10n;
        console.log(
          "estimate approve gas:%d , my approve gas: %d",
          gas,
          gasPrice
        );

        writeContract(config, {
          abi: currentConfig.usdt.abi,
          address: currentConfig.usdt.address,
          functionName: "approve",
          args: [currentConfig.business.address, uNum],
          gas: gasPrice,
          // gas,
        })
          .then(async (hash) => {
            console.log("approve res", hash);
            const transactionReceipt = await waitForTransactionReceipt(config, {
              hash,
            });
            if (transactionReceipt.status == "success") reslove();
          })
          .catch((err: BaseError) => {
            console.log("approve error", err);
            reject(err);
          });
      })
      .catch((err: BaseError) => {
        console.log("estimate approve gas error", err);
        reject(err);
      });
  });
};

/**
 * payByContract
 * @param amount
 * @param orderID
 */
export async function payByContract(
  amount: bigint,
  orderID: string,
  chainType: "bsc" | "tron"
) {
  var chain: Chain;
  if (import.meta.env.MODE == "production") {
    chain = chainType == "bsc" ? bsc : tron;
  } else {
    chain = chainType == "bsc" ? bscTestnet : tronTestnet;
  }
  await ensureCorrectNetwork(chain); // 传入目标链

  const currentConfig = await getChainConfig();
  const currentChainId = getChainId(config);
  console.log("当前网络：", currentChainId);
  console.log("pay buy contract params", { amount, orderID });
  console.log("NETWORK_USDT:", currentConfig.usdt.address);

  return new Promise<string>(async (reslove, reject) => {
    try {
      const balance = await getBalance();
      console.log("用户余额:", balance);
      if (balance < amount) {
        console.log("用户代币余额不足");
        reject(new BaseError("余额不足"));
        return;
      }

      console.log("当前要授权的U:", amount);
      let approvedU = await getApproveUsdt();
      if (approvedU < amount) {
        await authorizedU(amount);
      }
      console.log("参数:", amount, orderID);

      // 使用新的网络切换方法

      estimateGas(config, {
        to: currentConfig.business.address,
        data: encodeFunctionData({
          abi: currentConfig.business.abi,
          functionName: "pay",
          args: [orderID, amount],
        }),
      })
        .then((gas) => {
          const gasPrice = (gas * 12n) / 10n;
          console.log("estimate gas:%d , my gas: %d", gas, gasPrice);
          writeContract(config, {
            abi: currentConfig.business.abi,
            address: currentConfig.business.address,
            functionName: "pay",
            args: [orderID, amount],
            gas: gasPrice,
          })
            .then((receipt) => {
              console.log("write contract success!, receipt:", receipt);
              reslove(receipt);
            })
            .catch((err: BaseError) => {
              console.log("pay Transaction err", err);
              reject(err);
            });
        })
        .catch((err: BaseError) => {
          console.log("pay estimateGas err", err);
          reject(err);
        });
    } catch (err) {
      console.log("pay By Contract catch err", err);
      if (typeof err == "string") return reject(new BaseError(`${err}`));
      return reject(err);
    }
  });
}

// 新增通用网络切换方法
async function ensureCorrectNetwork(chain: Chain) {
  try {
    const currentChainId = getChainId(config);
    console.log("需要切换的网络", chain.id);
    console.log("当前网络:", currentChainId);

    if (currentChainId === chain.id) return;
    // 尝试直接切换网络
    await switchChain(config, { chainId: chain.id });
  } catch (switchError) {
    // 切换失败时添加网络
    const walletClient = createWalletClient({
      transport: custom(window.ethereum as any),
    });

    // 根据目标链ID获取链配置
    await walletClient.addChain({ chain: chain });

    // 再次尝试切换
    await switchChain(config, { chainId: chain.id });
  }
}

/**
 * @description: 轮询查询交易,获取nft
 */
export function usePollingCheckBuyStatus() {
  const [transcationStatus, setTranscationStatus] = useState<
    "success" | undefined
  >(undefined);
  const stop = useRef(false);

  function startPollingCheckBuyStatus(hash: string) {
    setTranscationStatus(undefined);
    polling(hash);
  }

  const checkStatus = async (hash: string) => {
    return new Promise<void>(async (reslove) => {
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: hash as `0x${string}`,
      });

      console.log("transaction receipt:", transactionReceipt);
      if (transactionReceipt.status == "success") {
        setTranscationStatus("success");
        stopPollingCheckBuyStatus();
        reslove();
        return;
      }

      setTimeout(() => {
        reslove();
      }, 2000);
    });
  };

  const polling = async (hash: string) => {
    await checkStatus(hash);
    if (stop.current) return;
    polling(hash);
  };

  function stopPollingCheckBuyStatus() {
    stop.current = true;
  }

  return {
    transcationStatus,
    startPollingCheckBuyStatus,
    stopPollingCheckBuyStatus,
  };
}
