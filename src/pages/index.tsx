import { checkIsValidToken } from '@/api/token'
import { Navigate } from 'react-router-dom'

export default function Page() {
  if (!checkIsValidToken()) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to="/my" replace />
}
