import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { DeleteUserModal } from './delete-user'

function UserItem({
  id,
  name,
  activeId,
}: {
  id: number
  name: string
  activeId: number
}) {
  const deleteModal = useDisclosure()

  return (
    <>
      <div className="group/edit relative">
        <div
          className={cn(
            'block  cursor-default rounded border-y-2  border-transparent bg-white px-4 py-2 shadow-sm transition',
            activeId !== -1 && 'opacity-50 group-hover:opacity-100',
            activeId === id && 'border-b-blue-500 opacity-100',
          )}
        >
          {name}
        </div>

        <button
          onClick={deleteModal[1].open}
          className="absolute bottom-2 right-4 grid h-8 w-8 place-items-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
      </div>
      <DeleteUserModal
        id={id}
        name={name}
        opened={deleteModal[0]}
        onClose={deleteModal[1].close}
      />
    </>
  )
}

export function AdminView() {
  const { isSuccess, data } = useQuery({
    queryKey: ['user-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            userName: string
            icon: string
            userId: number
            isAdmin: string
            userEmail: string
          }>
        >
      >('/admin/list-users'),
  })
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">用户管理</h3>
      <div className=" inset-0 flex flex-col gap-2 overscroll-y-auto p-2">
        {isSuccess &&
          data.data.data.map((user) => (
            <UserItem
              key={user.userId}
              id={user.userId}
              name={user.userName}
              activeId={user.userId}
            />
          ))}
      </div>
    </div>
  )
}
