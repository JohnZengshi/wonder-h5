// 在 utils/payment.ts 中
import { PopupTitle } from "@/components/PopupTitle";
import {
  NumberKeyboard,
  PasscodeInput,
  PasscodeInputRef,
  Popup,
  SafeArea,
} from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

type PaymentOptions = {
  amount: number;
  onConfirm?: (password: string) => void;
  onCancel?: () => void;
};

let paymentRoot: ReactDOM.Root | null = null;

const PaymentPasswordModal = ({ options }: { options: PaymentOptions }) => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const passcodeRef = useRef<PasscodeInputRef>(null);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => {
      passcodeRef.current?.focus();
    }, 300);
  }, []);

  const handleConfirm = () => {
    options.onConfirm?.(password);
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
      <PopupTitle title="支付密码" onClick={() => setVisible(false)} />
      <div className="flex flex-col items-center pb-[25px]">
        <span className="text-[56px] flex items-center font-[500] gap-[6px] mt-[49px]">
          <span className="text-[12px]">$</span>
          {options.amount}
        </span>
        <PasscodeInput
          ref={passcodeRef}
          seperated
          className="mt-[31px]"
          value={password}
          onChange={setPassword}
          keyboard={
            <NumberKeyboard
              visible={visible}
              confirmText="确认"
              onConfirm={handleConfirm}
            />
          }
        />
        {visible && <div className="w-full h-[240px]"></div>}
        <SafeArea position="bottom" />
      </div>
    </Popup>
  );
};

const destroy = () => {
  if (paymentRoot) {
    paymentRoot.unmount();
    paymentRoot = null;
  }
};

export const showPaymentPassword = (options: PaymentOptions) => {
  destroy();

  const container = document.createElement("div");
  document.body.appendChild(container);
  paymentRoot = ReactDOM.createRoot(container);

  paymentRoot.render(
    <PaymentPasswordModal
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
