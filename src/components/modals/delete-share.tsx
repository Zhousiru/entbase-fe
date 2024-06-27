import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Button, Modal, NativeSelect } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Fiedls {
  id: string
}

const splice = (fileName: string | null, path: string) => {
  return '文件名：' + fileName === null || ''
    ? '未命名'
    : fileName + '  ' + '文件路径：' + path
}

export function DeleteShareModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  const { data } = useQuery({
    queryKey: ['share-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            fileName: string
            startTime: string
            endTime: string
            filePath: string
            shareId: string
          }>
        >
      >('/share/list'),
  })

  const form = useForm<Fiedls>({
    mode: 'uncontrolled',
    initialValues: {
      id: '',
    },
    validate: {
      id: (value) => (value === '' ? '请选择需要删除的共享' : null),
    },
  })

  const queryClient = useQueryClient()

  const deleteBucketMutation = useMutation({
    mutationFn: (v: string) => $axios.post(`/share/delete/${v}`, {}),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['share-list'] })
      onClose()
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} title="删除共享">
      <form
        onSubmit={form.onSubmit((v) => {
          deleteBucketMutation.mutate(v.id)
        })}
      >
        <NativeSelect
          key={form.key('id')}
          {...form.getInputProps('id')}
          description="选择需要删除的共享链接"
          data={data?.data?.data.map((item) => {
            return {
              value: item.shareId,
              label: splice(item.fileName, item.filePath),
            }
          })}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button type="submit" color="red" variant="outline">
            确认
          </Button>
        </div>
      </form>
    </Modal>
  )
}
