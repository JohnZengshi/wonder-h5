import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mine/order')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mine/order"!</div>
}
