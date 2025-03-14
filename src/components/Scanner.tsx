import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Toast } from "antd-mobile";

export default function Scanner({
  onScanSuccess,
}: {
  onScanSuccess: (text: string) => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode("scanner-container", {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });

        const cameraConfig = {
          fps: 15,
          qrbox: 300,
          aspectRatio: 1,
          focusMode: "continuous",
          videoConstraints: {
            width: { min: 720, ideal: 1280 },
            height: { min: 720, ideal: 1280 },
            facingMode: "environment",
          },
        };

        await scanner.start(
          { facingMode: "environment" },
          cameraConfig,
          (decodedText) => {
            scanner.pause();
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            if (!errorMessage.includes("NotFoundException")) {
              console.warn("Scan error:", errorMessage);
            }
          }
        );

        scannerRef.current = scanner;
      } catch (err) {
        setCameraError(true);
        Toast.show("无法启动摄像头");
      }
    };

    if (!cameraError) {
      initScanner();
    }

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [cameraError]);

  return (
    <div className="relative h-full flex flex-col gap-[12px] bg-black">
      <div id="scanner-container" className="w-full aspect-square">
        <div className="absolute inset-0">
          <div className="border-2 border-red-500 w-[70%] aspect-square rounded-lg animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      <div className="text-[14px] text-center text-[#999999]">
        {cameraError ? "摄像头访问失败" : "将二维码置于框内保持稳定"}
      </div>
    </div>
  );
}
