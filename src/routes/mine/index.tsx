import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mine/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mine/"!</div>
}
