import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { ShareCard } from '@/components/share-card'
import { useQuery } from '@tanstack/react-query'
export default function Page() {
  const { isSuccess, data } = useQuery({
    queryKey: ['share-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            fileName: string
            startTime: string
            endTime: string
            filePath: string
            shareId: string
          }>
        >
      >('/share/list'),
  })

  return (
    <>
      <div className="relative flex flex-col gap-4 p-4">
        {isSuccess &&
          data.data.data.map((item) => (
            <ShareCard
              name={item.fileName}
              key={item.shareId}
              startTime={item.startTime}
              endTime={item.endTime}
              filePath={item.filePath}
              shareId={item.shareId}
            />
          ))}
      </div>
    </>
  )
}
