import {
  IconAlignJustified,
  IconFile,
  IconFolder,
  IconPhoto,
} from '@tabler/icons-react'
import { isImageExt, isTextExt } from './utils'

export function Item({
  name,
  type,
}: {
  name: string
  type: 'folder' | 'file'
}) {
  const extension = name.substring(name.lastIndexOf('.') + 1)

  return (
    <button className="group flex h-[150px] w-[150px] flex-col items-center justify-center gap-1 rounded-md border border-transparent transition hover:border-gray-200 hover:bg-gray-50">
      <div className="-mt-4 grid h-[120px] w-[120px] place-items-center text-blue-500">
        {type === 'folder' && (
          <IconFolder size={110} stroke={0.2} className="fill-blue-500/5" />
        )}
        {type === 'file' && (
          <>
            <IconFile size={100} stroke={0.2} className="fill-blue-500/5" />
            {isImageExt(extension) && <IconPhoto className="absolute mt-1" />}
            {isTextExt(extension) && (
              <IconAlignJustified className="absolute mt-1" />
            )}
          </>
        )}
      </div>
      <div className="-mt-4 max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap rounded border bg-gray-50 px-1 text-sm text-gray-600 transition group-hover:border-transparent">
        {name}
      </div>
    </button>
  )
}
