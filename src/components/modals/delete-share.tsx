import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { Button, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Fiedls {
  confirm: string
  id: number | null
}

export function DeleteShareModal({
  name,
  opened,
  onClose,
}: {
  name: string
  opened: boolean
  onClose: () => void
}) {
  const form = useForm<Fiedls>({
    mode: 'uncontrolled',
    initialValues: {
      confirm: '',
      id: null,
    },
    validate: {
      confirm: (value) =>
        value.trim() === `确认删除用户账号${name}及其及其用户文件`
          ? '请正确输入确认信息'
          : null,
    },
  })

  const queryClient = useQueryClient()

  const deleteBucketMutation = useMutation({
    mutationFn: (v: string) => $axios.delete(`/share/delete/${v}`, {}),
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
    <Modal opened={opened} onClose={onClose} title="删除用户">
      <form
        onSubmit={form.onSubmit((values) => {
          deleteBucketMutation.mutate(values.userId.toString())
        })}
      >
        <TextInput
          label={
            <span>
              请输入 <strong>删除共享 链接{name} </strong>
              以删除信息
            </span>
          }
          key={form.key('confirm')}
          {...form.getInputProps('confirm')}
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
