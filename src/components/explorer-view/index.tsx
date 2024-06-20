import { cn } from '@/utils/cn'
import { IconArrowUp } from '@tabler/icons-react'

export default function ExplorerView({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="box-border flex h-12 border-b">
        <button className="grid h-12 w-12 place-items-center border-r transition hover:bg-gray-200">
          <IconArrowUp stroke={1.5} />
        </button>
        <div className="flex items-center px-4 text-gray-600">
          /path/to/something
        </div>
      </div>
    </div>
  )
}
