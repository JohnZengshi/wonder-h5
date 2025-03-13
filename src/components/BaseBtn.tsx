import { css } from "@/lib/emotion";
import clsx from "clsx";

export function BaseBtn({
  title,
  onClick,
  icon,
  className,
  shadowColor,
  borderColor,
}: {
  title: string;
  onClick?: () => void;
  icon?: JSX.Element;
  className?: string;
  shadowColor?: string;
  borderColor?: string;
}) {
  return (
    <li
      onClick={() => onClick?.()}
      className={clsx(
        "flex items-center justify-center gap-[8px] rounded-[10px]",
        css`
          opacity: 1;
          background: rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          border: 1px solid ${borderColor ?? "#9795e9"};
          box-shadow:
            inset 1.73px 1.73px 12.94px 0px
              ${shadowColor ?? "rgba(151, 149, 233, 0.3)"},
            inset -1.73px -1.73px 12.94px 0px
              ${shadowColor ?? "rgba(151, 149, 233, 0.3)"};
        `,
        className
      )}
    >
      <span className="text-[14px]">{title}</span>
      {icon}
    </li>
  );
}
