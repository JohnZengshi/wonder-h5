// ... existing imports ...
import ReactDOM from "react-dom/client";
import { PopupTitle } from "@/components/PopupTitle";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Popup } from "antd-mobile";

type WalletModalConfig = {
  onConfirm: (walletType: "metamask" | "imtoken") => void;
  onCancel?: () => void;
};

let walletRoot: ReactDOM.Root | null = null;

const WalletModal = ({ config }: { config: WalletModalConfig }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Popup
      visible={visible}
      position="bottom"
      onMaskClick={() => {
        setVisible(false);
        config.onCancel?.();
      }}
      bodyStyle={{
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        background: "#1E1E1E",
      }}
      afterClose={() => destroy()}
    >
      <PopupTitle title="选择钱包" onClick={() => setVisible(false)} />
      <div className="px-[13px] py-[12px] pb-[49px]">
        <ul className="flex flex-col gap-[12px]">
          {[
            {
              title: "MetaMask",
              des1: "主流加密货币钱包",
              key: "metamask" as const,
            },
            {
              title: "ImToken",
              des1: "安全易用的数字钱包",
              key: "imtoken" as const,
            },
          ].map((v, i) => (
            <li
              key={i}
              className={clsx(
                "px-[11px] py-[10px] flex items-start gap-[14px] border rounded-[10px]",
                "border-[#353535] active:border-[#9795E9]"
              )}
              onClick={() => {
                config.onConfirm(v.key);
                setVisible(false);
              }}
            >
              <div className="w-[40px] h-[40px] bg-slate-500 rounded-lg" />
              <div className="flex flex-col">
                <span className="text-[14px] text-white">{v.title}</span>
                <span className="text-[12px] text-[#999999] mt-[4px]">
                  {v.des1}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Popup>
  );
};

const destroy = () => {
  if (walletRoot) {
    walletRoot.unmount();
    walletRoot = null;
    const container = document.getElementById("wallet-modal");
    container?.remove();
  }
};

export function showWalletModal(config: WalletModalConfig) {
  destroy();

  const container = document.createElement("div");
  container.id = "wallet-modal";
  document.body.appendChild(container);
  walletRoot = ReactDOM.createRoot(container);

  walletRoot.render(<WalletModal config={config} />);
}
