import { getValidTokenPayload } from '@/api/token'
import { AdminView } from '@/components/admin-view'
import UserView from '@/components/user'

export default function Page() {
  return (
    <>
      <div className="w-full border-[1px]	border-solid	">
        <UserView />
      </div>
      {getValidTokenPayload().isAdmin ? <AdminView /> : ''}
    </>
  )
}
