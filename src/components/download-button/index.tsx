import { $axios } from '@/api'
import { getFilename } from '@/utils/file'
import { IconDownload } from '@tabler/icons-react'
import { saveAs } from 'file-saver'
import { useState } from 'react'
import { RingProgressButton } from '../progress-ring-button'

export function DownloadButton({
  bucketId,
  path,
  className,
}: {
  bucketId?: number
  path: string
  className?: string
}) {
  const [progress, setProgress] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  async function handleDownload() {
    setProgress(0)
    setIsDownloading(true)

    const { data } = await $axios.post(
      '/file/get',
      { bucketId, path },
      {
        responseType: 'blob',
        timeout: 0,
        onDownloadProgress(e) {
          setProgress((e.progress ?? 0) * 100)
        },
      },
    )

    saveAs(data, getFilename(path))
    setIsDownloading(false)
  }

  return (
    <RingProgressButton
      progress={isDownloading ? progress : null}
      onClick={handleDownload}
      className={className}
    >
      <IconDownload size={20} />
    </RingProgressButton>
  )
}
