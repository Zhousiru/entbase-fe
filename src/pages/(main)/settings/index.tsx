import { getValidTokenPayload } from '@/api/token'
import { AdminView } from '@/components/admin-view'
import UserView from '@/components/user'
import { IconUser, IconUserCog } from '@tabler/icons-react'

export default function Page() {
  return (
    <div className="mx-auto flex max-w-screen-md flex-col gap-4 p-4">
      <div className="rounded-lg border">
        <div className="flex items-center gap-1 border-b px-4 py-2">
          <IconUser size={18} />
          我的资料
        </div>
        <div className="p-4">
          <UserView />
        </div>
      </div>

      {getValidTokenPayload().isAdmin && (
        <div className="rounded-lg border">
          <div className="flex items-center gap-1 border-b px-4 py-2">
            <IconUserCog size={18} />
            用户管理
          </div>
          <div className="p-2">
            <AdminView />
          </div>
        </div>
      )}
    </div>
  )
}
