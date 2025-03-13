import { css } from "@/lib/emotion";
import clsx from "clsx";
import { ReactNode } from "react";

export default function ({
  icon,
  iconStyle,
}: {
  icon?: ReactNode;
  iconStyle?: {
    borderColor?: string;
    shadowColor?: string;
  };
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        css`
          width: 30px;
          height: 30px;
          border-radius: 6px;
          opacity: 1;
          background: #020001;
          box-sizing: border-box;
          border: 1px solid ${iconStyle?.borderColor ?? "#9795E9"};
          box-shadow: inset 0px 0px 8px 0px
            ${iconStyle?.shadowColor ?? "rgba(158, 165, 235, 0.6)"};
          font-size: 20px;
        `,
        "flex items-center"
      )}
    >
      {icon}
    </div>
  );
}
