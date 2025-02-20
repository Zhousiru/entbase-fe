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
import React, { useEffect, useRef, useState } from 'react'
import { gotoParentPath, joinPaths } from '../../utils/file'
import { CreateShareModal } from '../modals/create-share'
import { NewFolderModal } from '../modals/new-folder'
import { PreviewData, PreviewFileModal } from '../modals/preview-file'
import { RenameFileModal } from '../modals/rename-file'
import { RingProgressButton } from '../progress-ring-button'
import { Item } from './item'
import { FileItem } from './types'
import { generateRandom7Hex } from './utils'

export default function ExplorerView({
  bucketId,
  className,
}: {
  bucketId?: number
  className?: string
}) {
  const [path, setPath] = useState('/')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPath('/')
  }, [bucketId])

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
  const { isSuccess: spaceIsSuccess, data: spaceData } = useQuery({
    queryKey: ['bucket-space', bucketId],
    queryFn: () =>
      $axios.post<ApiOk<FileItem[]>>(
        '/file/space',
        {},
        {
          params: {
            bucketId,
          },
        },
      ),
  })
  const deleteFileMutation = useMutation({
    mutationFn: (v: { path: string }) =>
      $axios.post('/file/delete', {}, { params: { bucketId, path: v.path } }),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, path],
      })
      queryClient.invalidateQueries({
        queryKey: ['bucket-space', bucketId],
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
    mutationFn: async (v: { sourcePath: string; targetPath: string }) => {
      await $axios.post('/file/move', {
        bucketId,
        ...v,
      })
    },
    onSuccess(_, v) {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, path],
      })
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, gotoParentPath(v.targetPath)],
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
  const createShareModal = useDisclosure()
  const previewFileModal = useDisclosure()

  const [renamePath, setRenamePath] = useState('')
  const [sharePath, setSharePath] = useState('')
  const [previewPath, setPreviewPath] = useState('')
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)

  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  function handleClick(name: string) {
    if (!isSuccess) return

    if (name === '..') {
      setPath(gotoParentPath(path))
      return
    }

    const { isFolder, createTime, updateTime, userEmail, userName, userId } =
      data.data.data.find((item) => item.fileName === name)!
    if (isFolder) {
      setPath(joinPaths(path, name))
    } else {
      setPreviewPath(joinPaths(path, name))
      setPreviewData({
        createTime,
        updateTime,
        email: userEmail,
        username: userName,
        id: userId,
      })
      previewFileModal[1].open()
    }
  }
  function handleRename(name: string) {
    setRenamePath(joinPaths(path, name))
    renameModal[1].open()
  }
  function handleShare(name: string) {
    if (!isSuccess) return

    const { path } = data.data.data.find((item) => item.fileName === name)!
    setSharePath(path)

    createShareModal[1].open()
  }
  function handleDelete(name: string) {
    deleteFileMutation.mutate({ path: joinPaths(path, name) })
  }
  function handleRecycleBin(name: string) {
    const sourcePath = joinPaths(path, name)

    let index = name.lastIndexOf('.')
    if (index === -1) {
      index = name.length
    }

    const filename = name.substring(0, index)
    const ext = name.substring(index)

    const targetPath = joinPaths(
      '/__RECYCLE_BIN',
      filename + '-' + generateRandom7Hex() + ext,
    )

    moveMutation.mutate({ sourcePath, targetPath })
  }
  function handleMoveInto(name: string, from: string) {
    const sourcePath = joinPaths(path, from)
    let targetPath: string
    if (name === '..') {
      targetPath = joinPaths(gotoParentPath(path), from)
    } else {
      targetPath = joinPaths(path, name, from)
    }

    moveMutation.mutate({ sourcePath, targetPath })
  }

  function handleSelectFile() {
    fileInputRef.current!.click()
  }
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    const form = new FormData()
    form.set('path', joinPaths(path, file.name))
    bucketId && form.set('bucketId', bucketId.toString())
    form.set('file', file)

    try {
      await $axios.post('/file/upload', form, {
        onUploadProgress(progressEvent) {
          setUploadProgress((progressEvent.progress ?? 0) * 100)
        },
        timeout: 0,
      })
    } catch (e) {
      notifications.show({
        ...notificationError,
        message: (e as Error).message,
      })
    } finally {
      setUploadProgress(null)
    }

    queryClient.invalidateQueries({
      queryKey: ['bucket-list', bucketId, path],
    })
    queryClient.invalidateQueries({
      queryKey: ['bucket-space', bucketId],
    })

    e.target.value = ''
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
                    {path !== '/' && (
                      <Item
                        name=".."
                        type="folder"
                        onClick={handleClick}
                        onRename={handleRename}
                        onShare={handleShare}
                        onDelete={handleDelete}
                        onMoveInto={handleMoveInto}
                      />
                    )}
                    {data.data.data.map((item) => (
                      <Item
                        key={item.path}
                        name={item.fileName}
                        type={item.isFolder ? 'folder' : 'file'}
                        recycleBin={
                          !joinPaths(path, item.fileName).startsWith(
                            '/__RECYCLE_BIN',
                          )
                        }
                        onClick={handleClick}
                        onRename={handleRename}
                        onShare={handleShare}
                        onDelete={handleDelete}
                        onRecycleBin={handleRecycleBin}
                        onMoveInto={handleMoveInto}
                      />
                    ))}
                    {data.data.data.length === 0 && path === '/' && (
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

      <div className="absolute bottom-4 right-8 flex w-32 rounded-full border">
        <div className="flex flex-col justify-center pl-4">
          <div className="text-xs leading-tight opacity-25">剩余容量</div>
          <div className="text-sm leading-tight opacity-75">
            {spaceIsSuccess ? spaceData.data.data + ' MB' : '-- MB'}
          </div>
        </div>
        <RingProgressButton
          onClick={handleSelectFile}
          progress={uploadProgress}
          className="ml-auto"
        >
          <IconUpload size={20} />
        </RingProgressButton>
      </div>

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
      <CreateShareModal
        path={sharePath}
        opened={createShareModal[0]}
        onClose={createShareModal[1].close}
      />
      <PreviewFileModal
        bucketId={bucketId}
        path={previewPath}
        data={previewData}
        opened={previewFileModal[0]}
        onClose={previewFileModal[1].close}
      />
    </>
  )
}
