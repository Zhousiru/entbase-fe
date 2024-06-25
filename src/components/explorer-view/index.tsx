import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowUp, IconMoodEmpty, IconUpload } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { RenameFileModal } from '../modals/rename-file'
import { Item } from './item'
import { FileItem } from './types'
import { gotoParentPath, joinPaths } from './utils'

export default function ExplorerView({
  bucketId,
  className,
}: {
  bucketId: number
  className?: string
}) {
  const [path, setPath] = useState('/')

  const { isSuccess, data } = useQuery({
    queryKey: ['bucket-list', bucketId, path],
    queryFn: () =>
      $axios.post<ApiOk<FileItem[]>>(
        '/file/list',
        {},
        {
          params: {
            bucketId,
            path,
          },
        },
      ),
  })

  const renameModal = useDisclosure()
  const [renamePath, setRenamePath] = useState('')

  function handleClick(name: string) {
    if (!isSuccess) return null

    const { isFolder } = data.data.data.find((item) => item.fileName === name)!
    if (isFolder) {
      setPath(joinPaths(path, name))
    } else {
      alert('Download file' + name)
    }
  }
  function handleRename(name: string) {
    setRenamePath(joinPaths(path, name))
    renameModal[1].open()
  }
  function handleShare(_name: string) {}
  function handleDelete(_name: string) {}
  function handleMoveInto(_from: string) {}

  return (
    <div className={cn('relative flex flex-col', className)}>
      <div className="box-border flex h-12 border-b">
        <button
          className="grid h-12 w-12 place-items-center border-r transition hover:bg-gray-200"
          onClick={() => setPath((prev) => gotoParentPath(prev))}
        >
          <IconArrowUp stroke={1.5} />
        </button>
        <div className="flex items-center px-4 text-gray-600">{path}</div>
      </div>
      <div className="relative flex-grow">
        <div className="absolute inset-0 flex flex-wrap content-start justify-start gap-4 overflow-y-scroll p-4">
          {isSuccess && (
            <>
              {data.data.data.map((item) => (
                <Item
                  key={item.path}
                  name={item.fileName}
                  type={item.isFolder ? 'folder' : 'file'}
                  onClick={handleClick}
                  onRename={handleRename}
                  onShare={handleShare}
                  onDelete={handleDelete}
                  onMoveInto={handleMoveInto}
                />
              ))}
              {data.data.data.length === 0 && (
                <div className="absolute inset-0 grid place-items-center opacity-25">
                  <div className="grid place-items-center gap-2">
                    <IconMoodEmpty stroke={1} size={72} />
                    <p className="text-lg">这里什么都没有</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => alert('上传文件')}
        className="absolute bottom-4 right-8 grid h-12 w-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
      >
        <IconUpload size={20} />
      </button>

      <RenameFileModal
        bucketId={bucketId}
        path={renamePath}
        opened={renameModal[0]}
        onClose={renameModal[1].close}
      />
    </div>
  )
}
