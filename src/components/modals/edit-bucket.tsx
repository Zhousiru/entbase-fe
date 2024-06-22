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
  bucketId: number
}

export function EditBucketModal({
  id,
  opened,
  onClose,
}: {
  id: number
  opened: boolean
  onClose: () => void
}) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bucketId: id,
      bucketName: '',
    },
    validate: {
      bucketName: (value) => (value.trim() === '' ? '请输入桶名！' : null),
    },
  })
  const editBucketMutation = useMutation({
    mutationFn: (v: Fiedls) =>
      $axios.post<ApiOk<string>>(
        '/admin/edit-bucket',
        {},
        { params: { bucketName: v.bucketName, bucketId: v.bucketId } },
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

  const deleteBucketMutation = useMutation({
    mutationFn: (v: string) =>
      $axios.post<ApiOk<string>>(
        '/admin/delete-bucket',
        {},
        { params: { bucketId: v } },
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
    <Modal opened={opened} onClose={onClose} title="编辑存储桶">
      <form
        onSubmit={form.onSubmit((values) => {
          editBucketMutation.mutate(values)
        })}
      >
        <TextInput
          label="重命名："
          key={form.key('bucketName')}
          {...form.getInputProps('bucketName')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">修改</Button>
          <Button
            type="button"
            color="red"
            onClick={() => deleteBucketMutation.mutate(id.toString())}
          >
            删除
          </Button>
        </Group>
      </form>
    </Modal>
  )
}
