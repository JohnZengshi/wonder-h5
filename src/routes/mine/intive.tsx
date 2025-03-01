import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar } from "antd-mobile";

export const Route = createFileRoute("/mine/intive")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  return (
    <div className="flex flex-col min-h-[100vh]">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => navigate({ to: ".." })}
      >
        <span className="text-[18px]">推荐好友</span>
      </NavBar>
    </div>
  );
}
