// 在 utils/payment.ts 中
import { PopupTitle } from "@/components/PopupTitle";
import FetchClient from "@/server";
import {
  NumberKeyboard,
  PasscodeInput,
  PasscodeInputRef,
  Popup,
  SafeArea,
} from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { showChangePassword } from "./password";
import { Md5 } from "ts-md5";

type PaymentOptions = {
  amount: number;
  onConfirm?: (password: string) => void;
  onCancel?: () => void;
};

let paymentRoot: ReactDOM.Root | null = null;

const PaymentPasswordModal = ({ options }: { options: PaymentOptions }) => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setVisible(true);
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
          ref={(ref) => ref?.focus()}
          seperated
          className="mt-[31px]"
          value={password}
          onChange={setPassword}
          keyboard={
            <NumberKeyboard
              visible={visible}
              confirmText="确认"
              onConfirm={handleConfirm}
              closeOnConfirm={false}
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

export const showPaymentPassword = async (options: PaymentOptions) => {
  destroy();

  // 查询用户是否设置支付密码
  const { data } = await FetchClient.GET("/api/account/findPasswordPay");
  if (!data?.data?.exist) {
    await new Promise((resolve, reject) => {
      showChangePassword({
        isFirst: true,
        onConfirmNew: async (psw) => {
          await FetchClient.POST("/api/account/renewPasswordPay", {
            body: { fromPassword: "", toPassword: Md5.hashStr(psw) },
          });
          resolve(true);
        },
        onCancel: () => {
          reject(false);
        },
      });
    });
  }
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
