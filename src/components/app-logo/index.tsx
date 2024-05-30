import { IconDatabaseSmile } from '@tabler/icons-react'

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <IconDatabaseSmile size={36} stroke={1.2} className="text-blue-500" />
      <div className="font-comfortaa text-2xl font-semibold">
        entbase
        <span className="text-blue-500">.</span>
      </div>
    </div>
  )
}
