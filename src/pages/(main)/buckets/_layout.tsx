import { $axios } from '@/api'
import { getValidTokenPayload } from '@/api/token'
import { ApiOk } from '@/api/types'
import { EditBucketModal } from '@/components/modals/edit-bucket'
import { NewBucketModal } from '@/components/modals/new-bucket'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconPlus, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

function BucketItem({
  id,
  name,
  activeId,
}: {
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
            'block rounded border-y-2 border-transparent bg-white  px-4 py-2 shadow-sm transition',
            activeId !== -1 && 'opacity-50 group-hover:opacity-100',
            activeId === id && 'border-b-blue-500 opacity-100',
          )}
        >
          {name}
        </Link>
        {getValidTokenPayload().isAdmin && (
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
        opened={editModal[0]}
        onClose={editModal[1].close}
      />
    </>
  )
}

export default function Layout() {
  const params = useParams()
  const activeBucketId = params.bucketId ? Number(params.bucketId) : -1

  const newModal = useDisclosure()
  const [buckets, setbBuckets] = useState<
    Array<{
      bucketId: number
      bucketSpace: number
      isPublic: string
      foldPath: string
      foldName: string
    }>
  >([])
  function loadBucketList() {
    $axios
      .post<
        ApiOk<
          Array<{
            bucketId: number
            bucketSpace: number
            isPublic: string
            foldPath: string
            foldName: string
          }>
        >
      >('/user/list-buckets')
      .then(({ data }) => {
        setbBuckets(data.data)
      })
  }

  useEffect(() => {
    loadBucketList()
  }, [])

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
            />
          </div>
          <div className="relative flex-grow bg-gray-50">
            <div className="absolute inset-0 flex flex-col gap-2 overscroll-y-auto p-2">
              {buckets.map((bucket) => (
                <BucketItem
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
