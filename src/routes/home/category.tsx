import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/category")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-auto items-center justify-center">
      <span className="text-[14px]"> Hello "/index/category"!</span>
    </div>
  );
}
