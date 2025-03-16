import FetchClient from "@/server";
import useStore from "@/store/useStore";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAsyncEffect } from "ahooks";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: () => {
    throw redirect({
      to: "/home",
      replace: true,
    });
  },
});

function Index() {
  return <></>;
}
