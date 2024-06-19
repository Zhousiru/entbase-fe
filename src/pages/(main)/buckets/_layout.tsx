import { cn } from '@/utils/cn'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
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
  return (
    <Link
      to={`${id}`}
      replace
      className={cn(
        'rounded border-y-2 border-transparent bg-white px-4 py-2 shadow-sm transition',
        activeId !== -1 && 'opacity-50 group-hover:opacity-100',
        activeId === id && 'border-b-blue-500 opacity-100',
      )}
    >
      {name}
    </Link>
  )
}

export default function Layout() {
  const params = useParams()
  const activeBucketId = params.bucketId ? Number(params.bucketId) : -1

  const [buckets] = useState([
    {
      bucketId: 1,
      bucketName: '共享存储桶 1',
    },
    {
      bucketId: 2,
      bucketName: '共享存储桶 2',
    },
    {
      bucketId: 3,
      bucketName: '共享存储桶 3',
    },
    {
      bucketId: 4,
      bucketName: '用户存储桶 Cirno',
    },
    {
      bucketId: 5,
      bucketName: '用户存储桶 bakaptr',
    },
  ])

  return (
    <>
      <div className="flex h-[calc(100dvh-60px)]">
        <div className="group flex w-[300px] flex-col border-r">
          <div className="flex items-center gap-2 border-b p-3">
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
                  name={bucket.bucketName}
                  activeId={activeBucketId}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex-grow">
          <div className="absolute inset-0">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}
