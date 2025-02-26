import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/shop")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-auto items-center justify-center">
      Hello "/index/shop"!
    </div>
  );
}
