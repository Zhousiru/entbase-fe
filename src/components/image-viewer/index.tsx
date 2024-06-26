import { $axios } from '@/api'
import { cn } from '@/utils/cn'
import { Progress } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export function ImageViewer({
  bucketId,
  path,
}: {
  bucketId?: number
  path: string
}) {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const { data, isSuccess } = useQuery({
    queryKey: ['file', bucketId, path],
    queryFn: () =>
      $axios.post(
        '/file/get',
        { bucketId, path },
        {
          responseType: 'blob',
          timeout: 0,
          onDownloadProgress(e) {
            setProgress((e.progress ?? 0) * 100)
          },
        },
      ),
    staleTime: 12 * 60 * 60 * 1000,
  })

  const srcUrl = useMemo(() => {
    if (!isSuccess) return
    return URL.createObjectURL(data.data)
  }, [data?.data, isSuccess])

  return (
    <div className="h-full bg-gray-50">
      <div
        className={cn('grid h-full place-items-center', isLoaded && 'hidden')}
      >
        <Progress className="w-full max-w-[300px]" value={progress} />
      </div>
      {srcUrl && (
        <img
          src={srcUrl}
          className={cn('h-full w-full object-contain', !isLoaded && 'hidden')}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}
