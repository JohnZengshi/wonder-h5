export function PopupTitle({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-[58px] relative">
      <span
        className="i-mdi-close text-[24px] text-[#A7A9AC] absolute left-[14px] top-[50%] -translate-y-1/2"
        onClick={onClick}
      ></span>
      <span className="text-[18px]">{title}</span>
    </div>
  );
}
