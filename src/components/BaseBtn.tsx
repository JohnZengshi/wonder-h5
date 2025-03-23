import { css } from "@/lib/emotion";
import { SpinLoading } from "antd-mobile";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export function BaseBtn({
  title,
  children,
  onClick,
  icon,
  className,
  shadowColor,
  borderColor,
  disabled,
  loading,
}: PropsWithChildren<{
  title?: string;
  onClick?: () => void;
  icon?: JSX.Element;
  className?: string;
  shadowColor?: string;
  borderColor?: string;
  disabled?: boolean;
  loading?: boolean;
}>) {
  return (
    <div
      onClick={() => !disabled && onClick?.()}
      className={clsx(
        "flex items-center justify-center gap-[8px] rounded-[10px] overflow-hidden",
        css`
          opacity: 1;
          background: rgba(0, 0, 0, 1);
          box-sizing: border-box;
          border: 1px solid ${borderColor ?? "#9795e9"};
          box-shadow:
            inset 1.73px 1.73px 12.94px 0px
              ${shadowColor ?? "rgba(151, 149, 233, 0.3)"},
            inset -1.73px -1.73px 12.94px 0px
              ${shadowColor ?? "rgba(151, 149, 233, 0.3)"};
        `,
        disabled ? "!opacity-50" : "",
        className
      )}
    >
      {loading && (
        <SpinLoading className="!w-[20px] !h-[20px]" color="primary" />
      )}
      {children ? (
        children
      ) : (
        <>
          <span className="text-[14px]">{title}</span>
          {icon}
        </>
      )}
    </div>
  );
}
