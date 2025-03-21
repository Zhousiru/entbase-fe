import { cn } from '@/utils/cn'
import * as ContextMenu from '@radix-ui/react-context-menu'
import {
  IconAlignJustified,
  IconArrowUp,
  IconCursorText,
  IconFile,
  IconFolder,
  IconLink,
  IconPhoto,
  IconTrash,
} from '@tabler/icons-react'
import React, { useState } from 'react'
import { isImageExt, isTextExt } from '../../utils/file'

export function Item({
  name,
  type,
  recycleBin = false,
  onClick,
  onRename,
  onShare,
  onDelete,
  onRecycleBin,
  onMoveInto,
}: {
  name: string
  type: 'folder' | 'file'
  recycleBin?: boolean
  onClick?: (name: string) => void
  onRename?: (name: string) => void
  onShare?: (name: string) => void
  onDelete?: (name: string) => void
  onRecycleBin?: (name: string) => void
  onMoveInto?: (name: string, from: string) => void
}) {
  const extension = name.substring(name.lastIndexOf('.') + 1)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragStart(e: React.DragEvent<HTMLButtonElement>) {
    e.dataTransfer.setData('text/plain', name)
    setIsDragging(true)
  }
  function handleDragEnd(e: React.DragEvent<HTMLButtonElement>) {
    e.dataTransfer.setData('text/plain', name)
    setIsDragging(false)
  }
  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    if (type === 'file' || isDragging) return
    e.preventDefault()
  }
  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    setIsDraggingOver(false)
    onMoveInto && onMoveInto(name, e.dataTransfer.getData('text/plain'))
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <button
          className={cn(
            'group flex h-[150px] w-[150px] flex-col items-center justify-center gap-1 rounded-md border border-transparent transition hover:border-gray-200 hover:bg-gray-50',
            isDragging && 'opacity-25',
            isDraggingOver && 'ring-2 ring-blue-500',
          )}
          onClick={onClick && (() => onClick(name))}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={() => setIsDraggingOver(type !== 'file' && !isDragging)}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          draggable={name !== '..' && name !== '__RECYCLE_BIN'}
        >
          <div className="pointer-events-none -mt-4 grid h-[120px] w-[120px] place-items-center text-blue-500">
            {type === 'folder' && (
              <>
                <IconFolder
                  size={110}
                  stroke={0.2}
                  className="fill-blue-500/5"
                />
                {name === '..' && <IconArrowUp className="absolute mt-1" />}
                {name === '__RECYCLE_BIN' && (
                  <IconTrash className="absolute mt-1" />
                )}
              </>
            )}
            {type === 'file' && (
              <>
                <IconFile size={100} stroke={0.2} className="fill-blue-500/5" />
                {isImageExt(extension) && (
                  <IconPhoto className="absolute mt-1" />
                )}
                {isTextExt(extension) && (
                  <IconAlignJustified className="absolute mt-1" />
                )}
              </>
            )}
          </div>
          <div className="pointer-events-none -mt-4 max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap rounded border bg-gray-50 px-1 text-sm text-gray-600 transition group-hover:border-transparent">
            {name === '__RECYCLE_BIN' ? '回收站' : name}
          </div>
        </button>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        {name !== '..' && name !== '__RECYCLE_BIN' && (
          <>
            <ContextMenu.Content className="flex w-[120px] flex-col gap-1 rounded-lg border bg-white p-1 text-left text-sm shadow-lg">
              <ContextMenu.Item asChild>
                <button
                  className="flex items-center gap-1 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                  onClick={onRename && (() => onRename(name))}
                >
                  <IconCursorText size={18} stroke={1} />
                  重命名
                </button>
              </ContextMenu.Item>
              {type !== 'folder' && (
                <ContextMenu.Item asChild>
                  <button
                    className="flex items-center gap-1 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                    onClick={onShare && (() => onShare(name))}
                  >
                    <IconLink size={18} stroke={1} />
                    共享
                  </button>
                </ContextMenu.Item>
              )}
              {recycleBin ? (
                <ContextMenu.Item asChild>
                  <button
                    className="flex items-center gap-1 rounded px-2 py-1 hover:bg-blue-500 hover:text-white"
                    onClick={onRecycleBin && (() => onRecycleBin(name))}
                  >
                    <IconTrash size={18} stroke={1} />
                    移到回收站
                  </button>
                </ContextMenu.Item>
              ) : (
                <ContextMenu.Item asChild>
                  <button
                    className="flex items-center gap-1 rounded px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={onDelete && (() => onDelete(name))}
                  >
                    <IconTrash size={18} stroke={1} />
                    永久删除
                  </button>
                </ContextMenu.Item>
              )}
            </ContextMenu.Content>
          </>
        )}
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}
