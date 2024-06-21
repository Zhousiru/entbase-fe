import { cn } from '@/utils/cn'
import { IconArrowUp } from '@tabler/icons-react'
import { Item } from './item'

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
      <div className="relative flex-grow">
        <div className="absolute inset-0 flex flex-wrap content-start justify-start gap-4 overflow-y-scroll p-4">
          {[1, 2, 3, 4].map((x) => (
            <Item key={x} name="Test Folder" type="folder" />
          ))}
          {[1, 2].map((x) => (
            <Item key={x} name="Test File.png" type="file" />
          ))}
          {[1, 2].map((x) => (
            <Item
              key={x}
              name="Test File.txtTest File.txtTest File.txtTest File.txt"
              type="file"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
