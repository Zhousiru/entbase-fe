import { getValidTokenPayload } from '@/api/token'
import { AdminView } from '@/components/admin-view'
import UserView from '@/components/user'

export default function Page() {
  return (
    <>
      <div>设置</div>
      {getValidTokenPayload().isAdmin ? <AdminView /> : <UserView />}
    </>
  )
}
