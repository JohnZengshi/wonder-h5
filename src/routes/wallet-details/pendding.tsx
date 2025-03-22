import { tronTestnet } from "@/network";
import useRecharg from "@/utils/useRecharg";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar, ResultPage } from "antd-mobile";
import { bsc, bscTestnet, tron } from "viem/chains";

export type penddingRouterParams = {
  anmout: string;
  chainType: 1 | 2;
  token: string;
};
export const Route = createFileRoute("/wallet-details/pendding")({
  component: RouteComponent,
  validateSearch: (search: penddingRouterParams): penddingRouterParams =>
    search,
});

function RouteComponent() {
  const { anmout, chainType } = Route.useSearch();
  const { navigate } = useRouter();
  const { payAmount } = useRecharg({
    defaultChainType: chainType,
    defaultPayAmount: anmout,
    successCallback() {
      var chainTypeStr = import.meta.env.DEV
        ? chainType == 1
          ? bscTestnet.name
          : tronTestnet.name
        : chainType == 1
          ? bsc.name
          : tron.name;
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
  const details = [
    {
      label: "付款方式",
      value: "钱包支付",
    },
    {
      label: "充值金额",
      value: `${anmout} USDT`,
    },
    {
      label: "网络",
      value: chainType,
    },
  ];
  return (
    <div className="flex flex-col">
      <NavBar
        className="!h-[44px] bg-[#9795E9]"
        onBack={() => window.history.back()}
      ></NavBar>
      <ResultPage
        status="success"
        title="充值中"
        description="请不要关闭此页面"
        details={details}
      />
    </div>
  );
}
