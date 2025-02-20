import { formatDate } from '@/utils/date'
import { getExt, getFilename, isImageExt, isTextExt } from '@/utils/file'
import { Modal } from '@mantine/core'
import { IconFileUnknown } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { Avatar } from '../avatar'
import { DownloadButton } from '../download-button'
import { ImageViewer } from '../image-viewer'
import { TextViewer } from '../text-viewer'

export interface PreviewData {
  createTime: string
  updateTime: string
  username: string
  email: string
  id: number
}

function PreviewSwitcher({
  ext,
  image,
  text,
  other,
}: {
  ext: string
  image: ReactNode
  text: ReactNode
  other: ReactNode
}) {
  if (isImageExt(ext)) {
    return image
  } else if (isTextExt(ext)) {
    return text
  } else {
    return other
  }
}

export function PreviewFileModal({
  bucketId,
  path,
  data,
  opened,
  onClose,
}: {
  bucketId?: number
  path: string
  data: PreviewData | null
  opened: boolean
  onClose: () => void
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={getFilename(path)}
      size="60rem"
      overlayProps={{
        color: '#fff',
        blur: 5,
      }}
      classNames={{
        content: 'border rounded-xl',
      }}
    >
      <div className="relative h-[65vh] overflow-hidden rounded-lg border">
        <div className="absolute inset-0 overflow-y-auto">
          <PreviewSwitcher
            ext={getExt(path)}
            image={<ImageViewer bucketId={bucketId} path={path} />}
            text={<TextViewer bucketId={bucketId} path={path} />}
            other={
              <div className="grid h-full place-items-center gap-2">
                <div className="grid place-items-center opacity-50">
                  <IconFileUnknown stroke={1} size={72} />
                  <p className="text-lg">无法提供此类文件预览</p>
                </div>
              </div>
            }
          />
        </div>
        <DownloadButton
          bucketId={bucketId}
          path={path}
          className="absolute bottom-6 right-6"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar id={data?.id} className="h-10 w-10" />
          <div>
            <div className="leading-tight">{data?.username}</div>
            <div className="text-sm leading-tight opacity-50">
              {data?.email}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center text-sm opacity-50">
          <div className="leading-tight">
            创建于 {formatDate(data?.createTime + 'Z')}
          </div>
          <div className="leading-tight">
            更新于 {formatDate(data?.updateTime + 'Z')}
          </div>
        </div>
      </div>
    </Modal>
  )
}
