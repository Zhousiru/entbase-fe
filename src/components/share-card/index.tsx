import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { formatDate } from '@/utils/date'
import { joinPaths } from '@/utils/file'
import { ActionIcon, Badge, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar } from '../avatar'
import { CopyGhostButton } from '../copy-ghost-button'

export interface ShareData {
  endTime: string
  fileName: string
  filePath: string
  shareId: string
  startTime: string
  userEmail: string
  userId: number
  userName: string
}

export function ShareCard({ data }: { data: ShareData }) {
  const queryClient = useQueryClient()

  const deleteShareMutation = useMutation({
    mutationFn: (v: string) => $axios.post(`/share/delete/${v}`, {}),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['share-list'] })
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  const split = data.filePath.split('/')
  const bucketName = split[2]
  const path = joinPaths(...split.slice(3))

  return (
    <div className="group flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Avatar id={data.userId} className="h-10 w-10" />
        <div>
          <div className="leading-tight">{data.userName}</div>
          <div className="leading-tight opacity-50">{data.userEmail}</div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold">{data.fileName}</div>
        <div className="flex items-center gap-1">
          <Badge variant="light">{bucketName}</Badge>
          <div className="text-xs opacity-50">{path}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm">
        <div className="opacity-50">过期时间：{formatDate(data.endTime)}</div>

        <div className="ml-auto opacity-0 transition group-hover:opacity-100">
          <CopyGhostButton
            value={window.location.origin + '/s/' + data.shareId}
            position="bottom"
          />
          <Tooltip withArrow label="删除" position="bottom">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => deleteShareMutation.mutate(data.shareId)}
            >
              <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
