import { checkIsValidToken } from '@/api/token'
import { Navigate, Outlet } from 'react-router-dom'

export default function Layout() {
  if (checkIsValidToken()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
