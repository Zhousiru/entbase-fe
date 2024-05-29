import { Outlet } from 'react-router-dom'

export default function Page() {
  return (
    <>
      <div className="text-red-500">layout</div>
      <Outlet />
    </>
  )
}
