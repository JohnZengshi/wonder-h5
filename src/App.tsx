import { Button } from "antd";
import { AppKitProvider } from "./AppKitProvider";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useDisconnect,
} from "@reown/appkit/react";
import clsx from "clsx";
import { css } from "./lib/emotion";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";

function App() {
  const { open, close } = useAppKit();
  const { isConnected, status } = useAppKitAccount();
  const events = useAppKitEvents();
  const { disconnect } = useDisconnect();
  return (
    <>
      <StyleProvider transformers={[px2remTransformer({ rootValue: 37.5 })]}>
        <AppKitProvider>
          <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            {!isConnected ? (
              <Button
                className={clsx(
                  "text-black/90",
                  css`
                    > span {
                      font-size: 14px;
                      line-height: 14px;
                    }
                  `
                )}
                onClick={() => open()}
              >
                connect
              </Button>
            ) : (
              <>
                <span>已连接：{status}</span>
              </>
            )}
          </div>
        </AppKitProvider>
      </StyleProvider>
    </>
  );
}

export default App;
