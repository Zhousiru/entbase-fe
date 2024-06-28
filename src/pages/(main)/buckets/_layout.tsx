import { $axios } from '@/api'
import { getValidTokenPayload } from '@/api/token'
import { ApiOk } from '@/api/types'
import { EditBucketModal } from '@/components/modals/edit-bucket'
import { NewBucketModal } from '@/components/modals/new-bucket'
import { cn } from '@/utils/cn'
import { Alert } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconEdit,
  IconInfoCircle,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

function BucketItem({
  isUserBucket = false,
  id,
  name,
  activeId,
}: {
  isUserBucket?: boolean
  id: number
  name: string
  activeId: number
}) {
  const editModal = useDisclosure()

  return (
    <>
      <div className="group/edit relative">
        <Link
          to={`${id}`}
          replace
          className={cn(
            'block rounded border-y-2 border-transparent bg-white px-4 py-2 shadow-sm transition',
            activeId !== -1 && 'opacity-50 group-hover:opacity-100',
            activeId === id && 'border-b-blue-500 opacity-100',
          )}
        >
          {isUserBucket && '用户 '}
          {name}
        </Link>
        {getValidTokenPayload().isAdmin && !isUserBucket && (
          <button
            onClick={() => {
              editModal[1].open()
            }}
            className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded opacity-0 transition hover:bg-black/5 group-hover/edit:opacity-100"
          >
            <IconEdit size={16} />
          </button>
        )}
      </div>

      <EditBucketModal
        id={id}
        name={name}
        opened={editModal[0]}
        onClose={editModal[1].close}
      />
    </>
  )
}

export default function Layout() {
  const params = useParams()
  const activeBucketId = params.bucketId ? Number(params.bucketId) : -1

  const [nameFilter, setNameFilter] = useState('')

  const newModal = useDisclosure()

  const { isSuccess, data } = useQuery({
    queryKey: ['bucket-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            bucketId: number
            bucketSpace: number
            isPublic: string
            foldPath: string
            foldName: string
          }>
        >
      >('/user/list-buckets'),
  })

  return (
    <>
      <div className="flex h-[calc(100dvh-60px)]">
        <div className="group relative flex w-[300px] flex-col border-r">
          <div className="box-border flex h-12 items-center gap-2 border-b p-3">
            <IconSearch size={18} className="shrink-0" />
            <input
              type="text"
              placeholder="在找存储桶？"
              className="flex-grow outline-none"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="relative flex-grow bg-gray-50">
            <div className="absolute inset-0 flex flex-col gap-2 overscroll-y-auto p-2">
              {getValidTokenPayload().isAdmin && (
                <Alert color="blue" icon={<IconInfoCircle />}>
                  作为管理员，你可以在这里查看所有用户的个人存储桶
                </Alert>
              )}
              {isSuccess &&
                data.data.data
                  .filter(
                    ({ foldName }) =>
                      foldName !== getValidTokenPayload().userEmail,
                  )
                  .sort((a, b) => Number(b.isPublic) - Number(a.isPublic))
                  .filter(({ foldName }) => foldName.includes(nameFilter))
                  .map((bucket) => (
                    <BucketItem
                      isUserBucket={bucket.isPublic === '0'}
                      key={bucket.bucketId}
                      id={bucket.bucketId}
                      name={bucket.foldName}
                      activeId={activeBucketId}
                    />
                  ))}
            </div>
          </div>
          {getValidTokenPayload().isAdmin && (
            <button
              onClick={newModal[1].open}
              className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
            >
              <IconPlus />
            </button>
          )}
        </div>
        <div className="relative flex-grow">
          <div className="absolute inset-0">
            <Outlet />
          </div>
        </div>
      </div>
      <NewBucketModal opened={newModal[0]} onClose={newModal[1].close} />
    </>
  )
}
