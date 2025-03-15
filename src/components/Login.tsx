import { useAsyncEffect } from "ahooks";
import { Button, Input, Popup, Toast } from "antd-mobile";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useState } from "react";
import { Md5 } from "ts-md5";
import FetchClient from "@/server";
import useStore from "@/store/useStore";
import logo from "@/assets/logo.svg";
import { BaseBtn } from "./BaseBtn";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useRouter } from "@tanstack/react-router";
import { PopupTitle } from "./PopupTitle";
import Scanner from "./Scanner";

export default function () {
  const { navigate } = useRouter();
  const [visitorId, setVisitorId] = useState("");
  const { setToken, setAccount } = useStore();
  const [scannerVisble, setScannerVisble] = useState(false);
  useAsyncEffect(async () => {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    setVisitorId(`${visitorId}${new Date().getTime()}`); // TODO 测试！！！
  }, []);

  useAsyncEffect(async () => {
    if (!visitorId) return;
  }, [visitorId]);

  async function login(account?: string, password?: string) {
    console.log("password", password);
    const { data } = await FetchClient.POST("/api/account/signIn", {
      body: {
        account: account ?? visitorId,
        password: Md5.hashStr(password ?? ""),
        chainType: 2,
      },
    });
    setAccount(account ?? visitorId);
    if (data?.data?.token) setToken(data.data.token);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-[30px] bg-[#191919]">
      <img src={logo} className="w-[60px] h-[60px] mt-[84px]" alt="" />
      <span className="text-[28px] mt-[29px]">账号密码登录</span>
      <Input
        placeholder="账号"
        className="mt-[29px] h-[48px] rounded-[10px] px-[19px] border-[1px] border-[#9795E9] border-opacity-40"
      />
      <Input
        placeholder="密码"
        type="password"
        className="mt-[18px] h-[48px] rounded-[10px] px-[19px] border-[1px] border-[#9795E9] border-opacity-40"
      />
      <BaseBtn
        title="登录"
        className="h-[44px] px-[38px] mt-[29px]"
        shadowColor="rgba(255, 62, 201, 0.3)"
        onClick={() => login()}
      />
      <span className="text-[12px] text-[#666666] mt-auto">其他方式登录</span>
      <ul className="flex items-center gap-[19px] mt-[15px] mb-[36px]">
        {[
          {
            title: "设备登录",
            icon: <i className="i-hugeicons-smart-phone-01 text-[20px]"></i>,
            onCLick: async () => {
              const { data } = await FetchClient.POST("/api/account/signUp", {
                body: {
                  account: visitorId,
                  publicKey: "",
                  chainType: 2,
                },
              });
              login(visitorId, data?.data?.password);
            },
          },
          {
            title: "扫码登录",
            icon: <i className="i-hugeicons-qr-code text-[20px]"></i>,
            onCLick: () => setScannerVisble(true),
          },
        ].map((v, i) => (
          <li
            key={i}
            className="flex items-center flex-col gap-[2px]"
            onClick={v.onCLick}
          >
            {v.icon}
            <span className="text-[10px]">{v.title}</span>
          </li>
        ))}
      </ul>

      <Popup
        visible={scannerVisble}
        onClose={() => setScannerVisble(false)}
        onMaskClick={() => setScannerVisble(false)}
        destroyOnClose
      >
        <PopupTitle title="扫码登录" onClick={() => setScannerVisble(false)} />
        <div className="h-[500px]">
          <Scanner
            onScanSuccess={(code) => {
              if (code) {
                const params = new URLSearchParams(code);
                const account = params.get("account");
                const password = params.get("password");

                if (!account || !password) {
                  throw new Error("无效的二维码格式");
                }
                console.log(`code:${code}`);
                // code:account=10102e56f456aaffe97da1b2ede3ff0a1742046038037&password=8mugfa5hbh9dglni
                login(account, password);
                setAccount(account);
                setScannerVisble(false);
              }
            }}
          />
        </div>
      </Popup>
    </div>
  );
}
