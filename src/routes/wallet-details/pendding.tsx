import { tron, tronTestnet } from "@/network";
import useRecharg, { ChainType } from "@/utils/useRecharg";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";
import { NavBar, ResultPage } from "antd-mobile";
import { useEffect, useState } from "react";
import { bsc, bscTestnet } from "viem/chains";

export type penddingRouterParams = {
  anmout: string;
  chainType: ChainType;
  token: string;
  account: string;
};
export const Route = createFileRoute("/wallet-details/pendding")({
  component: RouteComponent,
  validateSearch: (search: penddingRouterParams): penddingRouterParams =>
    search,
});

function RouteComponent() {
  // const { anmout, chainType } = Route.useSearch();
  const { navigate } = useRouter();
  const [chainType, setChainType] = useState<ChainType>(1);
  const [payAmount, setPayAmount] = useState("0");
  const chainTypeStr = import.meta.env.DEV
    ? chainType == 1
      ? bscTestnet.name
      : tronTestnet.name
    : chainType == 1
      ? bsc.name
      : tron.name;
  const { recharg, payFail } = useRecharg({
    successCallback() {
      navigate({
        to: "/wallet-details/success",
        search: {
          anmout: payAmount,
          chainType: chainTypeStr,
        },
        replace: true,
      });
    },
  });

  useAsyncEffect(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(
      urlParams
    ) as unknown as penddingRouterParams;
    if (params.chainType && params.anmout) {
      setChainType(params.chainType);
      setPayAmount(params.anmout);
      await recharg(params.chainType, params.anmout);
    }
  }, []);
  return (
    <div className="flex flex-col">
      <NavBar className="!h-[44px] bg-[#9795E9]" backIcon={null}></NavBar>
      <ResultPage
        status={payFail ? "error" : "success"}
        title={payFail ? "充值失败" : "充值中"}
        description={payFail ? "请返回网页重新支付" : "请不要关闭此页面"}
        details={[
          {
            label: "付款方式",
            value: "钱包支付",
          },
          {
            label: "充值金额",
            value: `${payAmount} USDT`,
          },
          {
            label: "网络",
            value: chainTypeStr,
          },
        ]}
      />
    </div>
  );
}
