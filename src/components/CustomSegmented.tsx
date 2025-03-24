import { css } from "@/lib/emotion";
import clsx from "clsx";

type SegmentedProps = {
  options: Array<{ label: string; value: string | number }>;
  value?: string | number;
  onChange?: (value: string | number) => void;
};

export function CustomSegmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div
      className={css`
        --segmented-item-selected-background: transparent;
        height: 36px;
        border-radius: 176px;
        opacity: 1;
        background: rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        border: 1px solid #9795e9;
        box-shadow:
          inset 1.73px 1.73px 12.94px 0px rgba(255, 62, 201, 0.3),
          inset -1.73px -1.73px 12.94px 0px rgba(255, 62, 201, 0.3);
        padding: 4px !important;
        display: flex;
        align-items: center;
        gap: 4px;
      `}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={clsx(
            css`
              height: 28px;
              border: none;
              padding: 0 16px;
              background: transparent;
              color: #999999;
              font-family: Alibaba PuHuiTi 2;
              font-size: 14px;
              transition: all 0.3s ease;
              cursor: pointer;

              &:hover {
                background: rgba(150, 149, 233, 0.1);
              }

              &.active {
                border-radius: 104px;
                background-color: #9695e934;
                color: #9795e9;
              }
            `,
            { active: value === option.value }
          )}
          onClick={() => onChange?.(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
