import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { ShareCard, ShareData } from '@/components/share-card'
import { IconMoodEmpty } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const { isSuccess, data } = useQuery({
    queryKey: ['share-list'],
    queryFn: () => $axios.post<ApiOk<ShareData[]>>('/share/list'),
  })

  return (
    <>
      <div className="mx-auto flex max-w-screen-md flex-col gap-4 p-4">
        {isSuccess && (
          <>
            {data.data.data.length === 0 && (
              <div className="mt-[10vh] grid place-items-center gap-2 opacity-25">
                <IconMoodEmpty stroke={1} size={72} />
                <p className="text-lg">还没有共享链接</p>
              </div>
            )}
            {data.data.data.map((item) => (
              <ShareCard key={item.shareId} data={item} />
            ))}
          </>
        )}
      </div>
    </>
  )
}
