import {
  ActionIcon,
  CopyButton,
  FloatingPosition,
  Tooltip,
} from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export function CopyGhostButton({
  value,
  position = 'right',
  className,
}: {
  value: string
  position?: FloatingPosition
  className?: string
}) {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? '已复制' : '复制'}
          withArrow
          position={position}
        >
          <ActionIcon
            color={copied ? 'teal' : 'blue'}
            variant="subtle"
            onClick={copy}
            className={className}
          >
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  )
}
