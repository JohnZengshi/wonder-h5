import { Tabs } from "antd-mobile";
import { BaseBtn } from "@/components/BaseBtn";
import { PopupTitle } from "@/components/PopupTitle";
import { Input, NumberKeyboard, Popup, Button } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

type WithdrawOptions = {
  onConfirm?: (chain: number, address: string, amount: number) => void;
  onCancel?: () => void;
};

const WithdrawModal = ({ options }: { options: WithdrawOptions }) => {
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(""); // 新增金额状态
  const [selectedChain, setSelectedChain] = useState(1); // 1=BSC 2=TRX
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleWithdraw = () => {
    if (!address || !amount) return; // 增加金额校验
    options.onConfirm?.(selectedChain, address, Number(amount)); // 传
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
      <PopupTitle title="提币" onClick={() => setVisible(false)} />
      <div className="flex flex-col p-4 gap-4">
        <Tabs
          activeKey={selectedChain.toString()}
          onChange={(key) => setSelectedChain(Number(key))}
          style={{ "--title-font-size": "14px", "--content-padding": "0" }}
        >
          <Tabs.Tab title="BSC链" key="1" />
          <Tabs.Tab title="TRX链" key="2" />
        </Tabs>

        <Input
          ref={inputRef}
          placeholder={`请输入${selectedChain === 10 ? "BSC" : "TRX"}地址`}
          value={address}
          onChange={setAddress}
          className="!text-[14px]"
        />

        {/* 新增金额输入框 */}
        <Input
          placeholder="请输入提币数量"
          value={amount}
          onChange={setAmount}
          type="number"
          className="!text-[14px]"
        />

        <BaseBtn
          title="确认提币"
          onClick={handleWithdraw}
          disabled={!address || !amount} // 更新禁用条件
          className="mt-[10px] h-[44px]"
        />
      </div>
    </Popup>
  );
};

let withdrawRoot: ReactDOM.Root | null = null;

const destroy = () => {
  if (withdrawRoot) {
    withdrawRoot.unmount();
    withdrawRoot = null;
    const container = document.getElementById("transfer-modal");
    container?.remove();
  }
};

// 新增提币弹窗调用方法
export const showWithdrawModal = (options: WithdrawOptions) => {
  destroy();

  const container = document.createElement("div");
  container.id = "withdraw-modal";
  document.body.appendChild(container);
  withdrawRoot = ReactDOM.createRoot(container);
  withdrawRoot.render(
    <WithdrawModal
      options={{
        ...options,
        onCancel: () => {
          options.onCancel?.();
          withdrawRoot?.unmount();
          container.remove();
        },
      }}
    />
  );
};
