import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import * as ContextMenu from '@radix-ui/react-context-menu'
import {
  IconArrowUp,
  IconFolderPlus,
  IconMoodEmpty,
  IconRefresh,
  IconUpload,
} from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import { gotoParentPath, joinPaths } from '../../utils/file'
import { NewFolderModal } from '../modals/new-folder'
import { RenameFileModal } from '../modals/rename-file'
import { Item } from './item'
import { FileItem } from './types'

export default function ExplorerView({
  bucketId,
  className,
}: {
  bucketId: number
  className?: string
}) {
  const [path, setPath] = useState('/')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()

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
  const deleteFileMutation = useMutation({
    mutationFn: (v: { bucketId: number; path: string }) =>
      $axios.post(
        '/file/delete',
        {},
        { params: { bucketId: v.bucketId, path: v.path } },
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, path],
      })
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })
  const moveMutation = useMutation({
    mutationFn: async (v: { from: string; to: string }) => {
      await $axios.post('/file/move', {
        bucketId,
        sourcePath: joinPaths(path, v.from),
        targetPath: joinPaths(path, v.to, v.from),
      })
    },
    onSuccess(_, v) {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, path],
      })
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, joinPaths(path, v.to)],
      })
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  const renameModal = useDisclosure()
  const newFolderModal = useDisclosure()
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
  function handleDelete(name: string) {
    deleteFileMutation.mutate({ bucketId, path: joinPaths(path, name) })
  }
  function handleMoveInto(name: string, from: string) {
    moveMutation.mutate({ from, to: name })
  }

  function handleSelectFile() {
    fileInputRef.current!.click()
  }
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    const form = new FormData()
    form.set('path', joinPaths(path, file.name))
    form.set('bucketId', bucketId.toString())
    form.set('file', file)

    await $axios.post('/file/upload', form, {
      onUploadProgress(progressEvent) {
        console.log('Progress', progressEvent.progress)
      },
      timeout: 0,
    })

    queryClient.invalidateQueries({
      queryKey: ['bucket-list', bucketId, path],
    })
  }

  return (
    <>
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

        <ContextMenu.Root>
          <ContextMenu.Trigger asChild>
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
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className="flex w-[120px] flex-col gap-1 rounded-lg border bg-white p-1 text-left text-sm shadow-lg">
              <ContextMenu.Item asChild>
                <button
                  className="flex items-center gap-1 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                  onClick={newFolderModal[1].open}
                >
                  <IconFolderPlus size={18} stroke={1} />
                  新建文件夹
                </button>
              </ContextMenu.Item>
              <ContextMenu.Item asChild>
                <button
                  className="flex items-center gap-1 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ['bucket-list', bucketId, path],
                    })
                  }
                >
                  <IconRefresh size={18} stroke={1} />
                  刷新
                </button>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>

      <button
        onClick={handleSelectFile}
        className="absolute bottom-4 right-8 grid h-12 w-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
      >
        <IconUpload size={20} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <RenameFileModal
        bucketId={bucketId}
        path={renamePath}
        opened={renameModal[0]}
        onClose={renameModal[1].close}
      />
      <NewFolderModal
        bucketId={bucketId}
        path={path}
        opened={newFolderModal[0]}
        onClose={newFolderModal[1].close}
      />
    </>
  )
}
