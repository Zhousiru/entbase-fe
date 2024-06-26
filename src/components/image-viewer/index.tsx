import { $axios } from '@/api'
import { cn } from '@/utils/cn'
import { Progress } from '@mantine/core'
import { useEffect, useState } from 'react'

export function ImageViewer({
  bucketId,
  path,
}: {
  bucketId?: number
  path: string
}) {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [srcUrl, setSrcUrl] = useState('')

  useEffect(() => {
    setProgress(0)
    setIsLoaded(false)

    const controller = new AbortController()

    $axios
      .post(
        '/file/get',
        { bucketId, path },
        {
          responseType: 'blob',
          timeout: 0,
          signal: controller.signal,
          onDownloadProgress(e) {
            setProgress((e.progress ?? 0) * 100)
          },
        },
      )
      .then(({ data }) => {
        setSrcUrl(URL.createObjectURL(data))
      })

    return () => controller.abort()
  }, [bucketId, path])

  return (
    <div>
      <div
        className={cn(
          'grid h-[450px] place-items-center bg-gray-50',
          isLoaded && 'hidden',
        )}
      >
        <Progress className="w-full max-w-[300px]" value={progress} />
      </div>
      {srcUrl && (
        <img
          src={srcUrl}
          className={cn(!isLoaded && 'hidden')}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}
