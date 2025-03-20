import { Popup, List, Button } from "antd-mobile";
import ReactDOM from "react-dom/client";
import { PopupTitle } from "@/components/PopupTitle";
import { useEffect, useState } from "react";
import bsc from "@/assets/bsc.svg";
import tron from "@/assets/tron.svg";
import clsx from "clsx";

type chain = "BSC" | "TRON";
type NetworkOptions = {
  onConfirm?: (network: chain) => void;
  onCancel?: () => void;
  default: chain;
};

let networkRoot: ReactDOM.Root | null = null;

const NetworkModal = ({ options }: { options: NetworkOptions }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<chain>(options.default);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Popup
      visible={visible}
      position="bottom"
      onMaskClick={() => {
        setVisible(false);
        options.onCancel?.();
      }}
      bodyStyle={{
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        background: "#1E1E1E",
      }}
      afterClose={() => destroy()}
    >
      <PopupTitle title="选择网络" onClick={() => setVisible(false)} />
      <div className="px-[13px] py-[12px] pb-[49px]">
        <ul className="flex flex-col gap-[12px]">
          {[
            {
              title: "BNB SMART CHAIN(BEP20)",
              des1: "预计到帐时间≈2分钟",
              des2: "最低充值≥0.01 USDT",
              icon: bsc,
              key: "BSC",
            },
            {
              title: "TRON(TRC20)",
              des1: "预计到帐时间≈2分钟",
              des2: "最低充值≥0.01 USDT",
              icon: tron,
              key: "TRON",
            },
          ].map((v, i) => (
            <li
              key={i}
              className={clsx(
                "px-[11px] py-[10px] flex items-start gap-[14px] border rounded-[10px]",
                v.key == selected ? "border-[#9795E9]" : "border-[#353535]"
              )}
              onClick={() => {
                setSelected(v.key as chain);
                options.onConfirm?.(v.key as chain);
                setVisible(false);
              }}
            >
              <img src={v.icon} className="w-[40px] h-[40px]" alt="" />
              <div className="flex flex-col">
                <span className="text-[14px]">{v.title}</span>
                <span className="text-[12px] text-[#999999] mt-[4px]">
                  {v.des1}
                </span>
                <span className="text-[12px] text-[#999999]">{v.des2}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Popup>
  );
};

const destroy = () => {
  if (networkRoot) {
    networkRoot.unmount();
    networkRoot = null;
    const container = document.getElementById("network-modal");
    container?.remove();
  }
};

export const showNetworkModal = (options: NetworkOptions) => {
  destroy();

  const container = document.createElement("div");
  container.id = "network-modal";
  document.body.appendChild(container);
  networkRoot = ReactDOM.createRoot(container);

  networkRoot.render(<NetworkModal options={options} />);
};
