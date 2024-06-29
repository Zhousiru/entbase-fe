import { AppLogo } from '@/components/app-logo'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="mt-[20vh] flex flex-col items-center gap-8 ">
      <div className="flex items-center gap-4">
        <AppLogo />
        <div className="self-stretch border-l" />
        <div className="text-lg font-light">文件共享</div>
      </div>
      <Outlet />
    </div>
  )
}
