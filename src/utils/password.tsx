import { PopupTitle } from "@/components/PopupTitle";
import {
  NumberKeyboard,
  PasscodeInput,
  PasscodeInputRef,
  Popup,
  SafeArea,
  Toast,
} from "antd-mobile";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
// 新增密码修改弹窗逻辑
type NewPasswordOptions = {
  isFirst: boolean;
  onConfirmOld?: (password: string) => void;
  onConfirmNew?: (newPassword: string) => void;
  onCancel?: () => void;
};

const NewPasswordModal = ({ options }: { options: NewPasswordOptions }) => {
  const [visible, setVisible] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(options.isFirst ? 2 : 1); // 1-旧密码 2-新密码

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleConfirm = async () => {
    if (!options.isFirst) {
      if (step === 1) {
        // if (await options.onConfirmOld?.(oldPwd)) {
        //   setStep(2);
        //   setOldPwd("");
        // } else {
        //   setError("旧密码错误");
        //   Toast.show("旧密码错误");
        //   return;
        // }
        options.onConfirmOld?.(oldPwd);
        setStep(2);
      } else {
        // if (newPwd !== confirmPwd) {
        //   setError("两次输入不一致");
        //   Toast.show("两次输入不一致");
        //   return;
        // }
        options.onConfirmNew?.(newPwd);
        setVisible(false);
      }
    } else {
      if (step == 2) {
        setStep(3);
        console.log("确认新密码", step);
      } else if (step == 3) {
        if (newPwd !== confirmPwd) {
          setError("两次输入不一致");
          Toast.show("两次输入不一致");
          return;
        }
        options.onConfirmNew?.(newPwd);
        setVisible(false);
      }
    }
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
      <PopupTitle
        title={
          step === 1 ? "验证旧密码" : step === 3 ? "确认新密码" : "设置新密码"
        }
      />
      <div className="flex flex-col items-center pb-[25px] h-[340px]">
        {step === 2 && (
          <>
            <PasscodeInput
              ref={(ref) => ref?.focus()}
              seperated
              value={newPwd}
              onChange={setNewPwd}
              aria-placeholder="请输入新密码"
              keyboard={
                <NumberKeyboard
                  visible={visible}
                  confirmText="确认"
                  onConfirm={handleConfirm}
                  closeOnConfirm={false}
                />
              }
            />
          </>
        )}
        {step === 3 && (
          <PasscodeInput
            ref={(ref) => ref?.focus()}
            className="mt-4"
            seperated
            value={confirmPwd}
            onChange={setConfirmPwd}
            aria-placeholder="确认新密码"
            keyboard={
              <NumberKeyboard
                visible={visible}
                confirmText="确认"
                onConfirm={handleConfirm}
                closeOnConfirm={false}
              />
            }
          />
        )}
        {step === 1 && (
          <PasscodeInput
            ref={(ref) => ref?.focus()}
            seperated
            value={oldPwd}
            onChange={setOldPwd}
            aria-placeholder="请输入旧密码"
            keyboard={
              <NumberKeyboard
                visible={visible}
                confirmText="确认"
                onConfirm={handleConfirm}
                closeOnConfirm={false}
              />
            }
          />
        )}

        <SafeArea position="bottom" />
      </div>
    </Popup>
  );
};

// 使用相同的基础设施方法
// 在类型定义后添加全局变量
let passwordRoot: ReactDOM.Root | null = null;
// 添加销毁函数
const destroy = () => {
  if (passwordRoot) {
    passwordRoot.unmount();
    passwordRoot = null;
    const container = document.getElementById("password-modal");
    container?.remove();
  }
};
// 补充 showChangePassword 实现
export const showChangePassword = (options: NewPasswordOptions) => {
  destroy();

  const container = document.createElement("div");
  container.id = "password-modal";
  document.body.appendChild(container);
  passwordRoot = ReactDOM.createRoot(container);

  passwordRoot.render(
    <NewPasswordModal
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
