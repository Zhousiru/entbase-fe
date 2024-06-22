import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { Button, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface Fiedls {
  bucketName: string
  bucketId: number
}

export function EditBucketModal({
  id,
  name,
  opened,
  onClose,
}: {
  id: number
  name: string
  opened: boolean
  onClose: () => void
}) {
  const { reset, ...form } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bucketId: id,
      bucketName: name,
    },
    validate: {
      bucketName: (value) => (value.trim() === '' ? '请输入存桶名' : null),
    },
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    opened && reset()
  }, [opened, reset])

  const editBucketMutation = useMutation({
    mutationFn: (v: Fiedls) =>
      $axios.post(
        '/admin/edit-bucket',
        {},
        { params: { bucketName: v.bucketName, bucketId: v.bucketId } },
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['bucket-list'] })
      onClose()
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
      $axios.post('/admin/delete-bucket', {}, { params: { bucketId: v } }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['bucket-list'] })
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
    <Modal opened={opened} onClose={onClose} title="编辑存储桶">
      <form
        onSubmit={form.onSubmit((values) => {
          editBucketMutation.mutate(values)
        })}
      >
        <TextInput
          label="存储桶名"
          key={form.key('bucketName')}
          {...form.getInputProps('bucketName')}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            color="red"
            variant="outline"
            onClick={() => deleteBucketMutation.mutate(id.toString())}
          >
            删除
          </Button>
          <Button type="submit">更新</Button>
        </div>
      </form>
    </Modal>
  )
}
