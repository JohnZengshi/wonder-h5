import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar } from "antd-mobile";

export const Route = createFileRoute("/mine/intive")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigate } = useRouter();
  return (
    <div className="flex flex-col min-h-[100vh]">
      <NavBar
        className="relative z-50 h-[44px]"
        onBack={() => navigate({ to: ".." })}
      >
        <span className="text-[18px]">推荐好友</span>
      </NavBar>
      <div className="flex flex-col px-[14px]">
        <div className="w-full flex items-center justify-center gap-[121px] mt-[42px]">
          {[
            {
              icon: <span className="i-mdi-invite"></span>,
              title: "直推人数",
              num: 100,
            },
            {
              icon: <span className="i-mdi-people-group-outline"></span>,
              title: "团队人数",
              num: 68,
            },
          ].map((v) => (
            <div className="flex flex-col items-center">
              <div className="text-[24px] text-[#A1A1A1] flex items-center justify-center">
                {v.icon}
              </div>
              <span className="text-[10px] mt-[2px]">{v.title}</span>
              <span className="text-[24px] mt-[5px] leading-[34px] font-bold text-[#893AF6]">
                {v.num}
              </span>
            </div>
          ))}
        </div>

        <div className="p-[17px] rounded-[10px] bg-[#1F1F1F] flex flex-col gap-[12px] mt-[23px]">
          {[
            {
              title: "邀请码",
              content: (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[16px] text-[#893AF6]">T2DF4H</span>
                    <span className="i-lucide-copy text-[24px] text-[#893AF6]"></span>
                  </div>
                </>
              ),
            },
            {
              title: "邀请链接",
              content: (
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[16px] text-[#893AF6]">
                      https://wonder.iighue=T2DF4H
                    </span>
                    <span className="i-lucide-copy text-[24px] text-[#893AF6]"></span>
                  </div>
                </>
              ),
            },
            {
              title: "二维码邀请",
              content: (
                <>
                  <div className="flex items-center justify-center w-full">
                    <span className="text-[14px] text-[#893AF6]">
                      点击生成图片
                    </span>
                  </div>
                </>
              ),
            },
          ].map((v) => (
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px]">{v.title}</span>
              <div className="rounded-[10px] border-[#511B7C] border h-[44px] px-[14px] flex items-center">
                {v.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <span className="text-[18px] my-[16px]">直推列表</span>
          <div className="rounded-[10px] border border-[#511B7C] overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="h-[37px] border-b border-[#511B7C]">
                  <th className="text-[12px] font-normal text-center">ID</th>
                  <th className="text-[12px] font-normal text-center">时间</th>
                  <th className="text-[12px] font-normal text-center">状态</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((item, index) => (
                  <tr
                    key={index}
                    className="h-[37px] border-b border-[#511B7C] last:border-b-0"
                  >
                    <td className="text-[10px] text-center text-[#999999]">
                      #12345
                    </td>
                    <td className="text-[10px] text-center text-[#999999]">
                      2023-09-01 12:00
                    </td>
                    <td className="text-[10px] text-center text-[#8639EF]">
                      成功
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
