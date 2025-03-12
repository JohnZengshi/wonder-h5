import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar } from "antd-mobile";

export const Route = createFileRoute("/card-secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  return (
    <div className="flex flex-col">
      <NavBar onBack={() => window.history.back()}>
        <span className="text-[18px]">我的卡密</span>
      </NavBar>
      <div className="px-[14px] pb-[15px] pt-[5px]">
        <div className="flex items-center justify-between border-b-[#511B7C] border-b py-[10px]">
          <span className="text-[12px]">卡密账号</span>
          <span className="text-[12px]">获得时间</span>
        </div>
        <ul>
          {Array.from({ length: 50 }).map((v) => (
            <li className="h-[44px] flex items-center justify-between border-b-[#2A2A2B] border-b">
              <span className="text-[14px]">U142144U142144U142144</span>
              <span className="text-[10px]">2024.01.20 17：20</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
