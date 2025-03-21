import { IconMoodWink } from '@tabler/icons-react'

export default function Page() {
  return (
    <div className="grid h-full place-items-center opacity-25">
      <div className="grid place-items-center gap-2">
        <IconMoodWink stroke={1} size={72} />
        <p className="text-lg">选择一个存储桶吧</p>
      </div>
    </div>
  )
}
