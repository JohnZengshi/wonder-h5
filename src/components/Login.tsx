import { useAsyncEffect } from "ahooks";
import { Button, Toast } from "antd-mobile";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useState } from "react";
import { Md5 } from "ts-md5";
import useStore from "@/store/useStore";
import FetchClient from "@/server";

export default function () {
  const [visitorId, setVisitorId] = useState("");
  const { setToken } = useStore();
  useAsyncEffect(async () => {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    setVisitorId(`${visitorId}${new Date().getTime()}`);
  }, []);

  useAsyncEffect(async () => {
    if (!visitorId) return;
  }, [visitorId]);

  async function login(password?: string) {
    console.log("password", password);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-[#191919]">
      <div className="flex items-center gap-[10px]">
        <Button onClick={() => login()}>登录</Button>
        <Button onClick={async () => {}}>注册</Button>
      </div>
    </div>
  );
}
