import { ActionIcon, CopyButton, Tooltip } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export function CopyGhostButton({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? '已复制' : '复制'} withArrow position="right">
          <ActionIcon
            color={copied ? 'teal' : 'gray'}
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
