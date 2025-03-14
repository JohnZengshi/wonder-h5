import { BaseBtn } from "@/components/BaseBtn";
import { PopupTitle } from "@/components/PopupTitle";
import { Input, NumberKeyboard, Popup, Button } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

type TransferOptions = {
  onConfirm?: (address: string, amount: number) => void;
  onCancel?: () => void;
};

let transferRoot: ReactDOM.Root | null = null;

const TransferModal = ({ options }: { options: TransferOptions }) => {
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleTransfer = () => {
    if (!address || !amount) {
      return;
    }
    options.onConfirm?.(address, Number(amount));
    setVisible(false);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={() => {
        setVisible(false);
        options.onCancel?.();
      }}
      afterClose={() => destroy()}
    >
      <PopupTitle title="转账" onClick={() => setVisible(false)} />
      <div className="flex flex-col p-4 gap-4 ">
        <Input
          ref={inputRef}
          placeholder="收款地址"
          value={address}
          onChange={setAddress}
          className="!text-[14px]"
        />
        <Input
          placeholder="请输入个数"
          value={amount}
          onChange={setAmount}
          className="!text-[14px]"
          type="number"
        />

        <BaseBtn
          title="确认转账"
          onClick={handleTransfer}
          disabled={!address || !amount}
          className="mt-[10px] h-[44px]"
        ></BaseBtn>
      </div>
    </Popup>
  );
};

const destroy = () => {
  if (transferRoot) {
    transferRoot.unmount();
    transferRoot = null;
    const container = document.getElementById("transfer-modal");
    container?.remove();
  }
};

export const showTransferModal = (options: TransferOptions) => {
  destroy();

  const container = document.createElement("div");
  container.id = "transfer-modal";
  document.body.appendChild(container);
  transferRoot = ReactDOM.createRoot(container);

  transferRoot.render(
    <TransferModal
      options={{
        ...options,
        onCancel: () => {
          options.onCancel?.();
          destroy();
        },
      }}
    />
  );
};
