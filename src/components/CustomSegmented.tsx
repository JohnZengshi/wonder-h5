import { css } from "@/lib/emotion";
import { Segmented, SegmentedProps } from "antd-mobile";

export function CustomSegmented(props: SegmentedProps) {
  return (
    <Segmented
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
        .adm-segmented-group {
          height: 28px;
        }
        .adm-segmented-item {
          height: 28px;
          &.adm-segmented-item-selected {
            border-radius: 104px;
            background-color: #9695e934;
          }
        }
        .adm-segmented-item-label {
          height: 100%;
          line-height: 28px !important;
          font-family: Alibaba PuHuiTi 2;
          font-size: 14px;
          font-weight: normal;
          line-height: normal;
          letter-spacing: 0em;
          font-variation-settings: "opsz" auto;
        }
      `}
      {...props}
    />
  );
}
