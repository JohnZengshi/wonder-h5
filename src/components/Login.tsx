import { useAsyncEffect } from "ahooks";
import { Button, Toast } from "antd-mobile";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useState } from "react";
import { Md5 } from "ts-md5";
import FetchClient from "@/server";
import useStore from "@/store/useStore";

export default function () {
  const [visitorId, setVisitorId] = useState("");
  const { setToken, setAccount } = useStore();
  useAsyncEffect(async () => {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    setVisitorId(`${visitorId}${new Date().getTime()}`); // TODO 测试！！！
  }, []);

  useAsyncEffect(async () => {
    if (!visitorId) return;
  }, [visitorId]);

  async function login(password?: string) {
    console.log("password", password);
    if (!password) return;
    const { data } = await FetchClient.POST("/api/account/signIn", {
      body: {
        account: visitorId,
        password: Md5.hashStr(password),
      },
    });
    setAccount(visitorId);
    if (data?.data?.token) setToken(data.data.token);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-[#191919]">
      <div className="flex items-center gap-[10px]">
        <Button onClick={() => login()}>登录</Button>
        <Button
          onClick={async () => {
            const { data } = await FetchClient.POST("/api/account/signUp", {
              body: {
                account: visitorId,
                publicKey: "",
                chainType: 2,
              },
            });
            login(data?.data?.password);
          }}
        >
          注册
        </Button>
      </div>
    </div>
  );
}
