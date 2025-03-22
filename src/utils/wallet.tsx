import { Dialog } from "antd-mobile";
import { css } from "@/lib/emotion";
import metamaskImg from "@/assets/images/metamask.png";
import imtokenImg from "@/assets/images/imtoken.png";
import clsx from "clsx";

type WalletModalConfig = {
  onConfirm: (walletType: "metamask" | "imtoken") => void;
  onCancel?: () => void;
};

export function showWalletModal(config: WalletModalConfig) {
  Dialog.show({
    content: (
      <div className="flex flex-col gap-4 p-4">
        <h3 className="text-center text-[#fff] text-lg">选择钱包</h3>
        <div className="flex flex-col gap-3">
          <div
            className={clsx(
              "flex items-center gap-3 p-3 rounded-lg",
              css`
                background: #1f1f1f;
                border: 1px solid rgba(145, 250, 255, 0.3);
                box-shadow: 0 2px 12px rgba(145, 250, 255, 0.1);
              `
            )}
            onClick={() => config.onConfirm("metamask")}
          >
            <img src={metamaskImg} className="w-8 h-8" />
            <span className="text-[#fff]">MetaMask</span>
          </div>
          <div
            className={clsx(
              "flex items-center gap-3 p-3 rounded-lg",
              css`
                background: #1f1f1f;
                border: 1px solid rgba(145, 250, 255, 0.3);
                box-shadow: 0 2px 12px rgba(145, 250, 255, 0.1);
              `
            )}
            onClick={() => config.onConfirm("imtoken")}
          >
            <img src={imtokenImg} className="w-8 h-8" />
            <span className="text-[#fff]">ImToken</span>
          </div>
        </div>
      </div>
    ),
    closeOnAction: true,
    actions: [
      {
        key: "cancel",
        text: "取消",
        className: "text-[#999]",
      },
    ],
  });
}
