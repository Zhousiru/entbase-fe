import { formatDate } from '@/utils/date'
import { getExt, getFilename, isImageExt, isTextExt } from '@/utils/file'
import { Avatar, Modal } from '@mantine/core'
import { IconFileUnknown, IconUser } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { DownloadButton } from '../download-button'
import { ImageViewer } from '../image-viewer'

export interface PreviewData {
  createTime: string
  updateTime: string
  username: string
  email: string
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
      <div className="relative overflow-hidden rounded-lg border">
        <PreviewSwitcher
          ext={getExt(path)}
          image={<ImageViewer bucketId={bucketId} path={path} />}
          text={<>123</>}
          other={
            <div className="grid h-[300px] place-items-center gap-2">
              <div className="grid place-items-center opacity-50">
                <IconFileUnknown stroke={1} size={72} />
                <p className="text-lg">无法提供此类文件预览</p>
              </div>
            </div>
          }
        />
        <DownloadButton
          bucketId={bucketId}
          path={path}
          className="absolute bottom-6 right-6"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar color="cyan" radius="xl">
            <IconUser />
          </Avatar>
          <div>
            <div className="leading-tight">{data?.username}</div>
            <div className="text-sm leading-tight opacity-50">
              {data?.email}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center text-sm opacity-50">
          <div className="leading-tight">
            创建于 {formatDate(data?.createTime + 'Z' ?? '')}
          </div>
          <div className="leading-tight">
            更新于 {formatDate(data?.updateTime + 'Z' ?? '')}
          </div>
        </div>
      </div>
    </Modal>
  )
}
