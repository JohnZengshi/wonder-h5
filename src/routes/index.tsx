import FetchClient from "@/server";
import useStore, { TokenStorage } from "@/store/useStore";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: () => {
    // 已登录用户重定向到主页
    throw redirect({
      to: "/home",
      replace: true,
    });
  },
});

function Index() {
  return <></>;
}
