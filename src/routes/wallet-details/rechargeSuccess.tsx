import { createFileRoute } from "@tanstack/react-router";
import { NavBar, ResultPage } from "antd-mobile";

type params = {
  anmout: string;
  chainType: string;
};
export const Route = createFileRoute("/wallet-details/rechargeSuccess")({
  component: RouteComponent,
  validateSearch: (search: params): params => search,
});

function RouteComponent() {
  const { anmout, chainType } = Route.useSearch();
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
        title="充值成功"
        description="充值成功！预计1分钟内到账，请耐心等待。可在平台积分页查看。"
        details={details}
      />
    </div>
  );
}
