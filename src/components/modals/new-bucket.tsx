import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import {
  notificationError,
  notificationSuccess,
} from '@/constants/notifications'
import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'

interface Fiedls {
  bucketName: string
}

export function NewBucketModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bucketName: '',
    },
    validate: {
      bucketName: (value) => (value.trim() === '' ? '请输入桶名！' : null),
    },
  })

  const createBucketMutation = useMutation({
    mutationFn: (v: Fiedls) =>
      $axios.post<ApiOk<string>>(
        '/admin/new-bucket',
        {},
        { params: { bucketName: v.bucketName } },
      ),
    onSuccess({ data }) {
      notifications.show({
        ...notificationSuccess,
        message: data.data,
      })
      setTimeout(() => {
        location.reload()
      }, 1000)
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} title="新增存储桶">
      <form
        onSubmit={form.onSubmit((values) => {
          createBucketMutation.mutate(values)
        })}
      >
        <TextInput
          label="命名："
          key={form.key('bucketName')}
          {...form.getInputProps('bucketName')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">创建</Button>
        </Group>
      </form>
    </Modal>
  )
}
