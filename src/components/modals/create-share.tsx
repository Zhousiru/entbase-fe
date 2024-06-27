import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Alert, Button, Modal, NativeSelect, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CopyGhostButton } from '../copy-ghost-button'

export function CreateShareModal({
  // path,
  opened,
  onClose,
}: {
  path: string
  opened: boolean
  onClose: () => void
}) {
  const [password, setPassword] = useState('')
  const [shareId, setShareId] = useState('')
  const [bucketId, setBucketId] = useState('')
  const [filePath, setFilePath] = useState('')

  const shareLink = window.location.origin + '/s/' + shareId

  // const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['bucket-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            bucketId: number
            bucketSpace: number
            isPublic: string
            foldPath: string
            foldName: string
          }>
        >
      >('/user/list-buckets'),
  })
  useEffect(() => {
    if (!opened) return
    setPassword('')
    setShareId('')
  }, [opened])

  const mutation = useMutation({
    mutationFn: async () =>
      $axios.post<ApiOk<string>>(
        '/share/create',
        {},
        {
          params: {
            password,
            filePath,
            bucketId,
          },
        },
      ),
    onSuccess(data) {
      setShareId(data.data.data)
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} title="创建共享">
      {shareId ? (
        <div>
          <Alert color="green" icon={<IconCheck />} title="创建成功">
            请记下此文件的共享链接
          </Alert>
          <TextInput
            className="mt-2"
            value={shareLink}
            readOnly
            rightSection={<CopyGhostButton value={shareLink} />}
          />
        </div>
      ) : (
        <>
          <NativeSelect
            value={bucketId}
            description="选择需要删除的共享链接"
            onChange={(e) => setBucketId(e.target.value)}
            data={data?.data?.data.map((item) => {
              return {
                value: item.bucketId.toString(),
                label: item.foldName,
              }
            })}
          />

          <TextInput
            label="存储路径"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
          />
          <TextInput
            label="共享密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}

      <div className="mt-4 flex justify-end">
        {shareId ? (
          <Button onClick={onClose}>关闭</Button>
        ) : (
          <Button type="submit" onClick={() => mutation.mutate()}>
            创建
          </Button>
        )}
      </div>
    </Modal>
  )
}
