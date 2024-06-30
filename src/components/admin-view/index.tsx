import { $axios } from '@/api'
import { getValidTokenPayload } from '@/api/token'
import { ApiOk } from '@/api/types'
import { ActionIcon, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from '../avatar'
import { DeleteUserModal } from './delete-user'

interface UserData {
  userName: string
  icon: string
  userId: number
  isAdmin: string
  userEmail: string
}

function UserItem({ data }: { data: UserData }) {
  const deleteModal = useDisclosure()

  return (
    <div className="group flex items-center rounded p-2 transition hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <Avatar id={data.userId} className="h-10 w-10" />
        <div>{data.userName}</div>
        <div className="opacity-50">{data.userEmail}</div>
      </div>

      {getValidTokenPayload().userEmail !== data.userEmail && (
        <Tooltip withArrow label="删除" position="right">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={deleteModal[1].open}
            className="ml-auto opacity-0 transition group-hover:opacity-100"
          >
            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}

      <DeleteUserModal
        id={data.userId}
        name={data.userName}
        opened={deleteModal[0]}
        onClose={deleteModal[1].close}
      />
    </div>
  )
}

export function AdminView() {
  const { isSuccess, data } = useQuery({
    queryKey: ['user-list'],
    queryFn: () => $axios.post<ApiOk<UserData[]>>('/admin/list-users'),
  })
  return (
    <div className="flex flex-col gap-2">
      {isSuccess &&
        data.data.data.map((user) => (
          <UserItem key={user.userId} data={user} />
        ))}
    </div>
  )
}
