import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { Button, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

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
  const { reset, ...form } = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bucketName: '',
    },
    validate: {
      bucketName: (value) => (value.trim() === '' ? '请输入存储桶名' : null),
    },
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    opened && reset()
  }, [opened, reset])

  const createBucketMutation = useMutation({
    mutationFn: (v: Fiedls) =>
      $axios.post(
        '/admin/new-bucket',
        {},
        { params: { bucketName: v.bucketName } },
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

  return (
    <Modal opened={opened} onClose={onClose} title="新增存储桶">
      <form
        onSubmit={form.onSubmit((values) => {
          createBucketMutation.mutate(values)
        })}
      >
        <TextInput
          label="存储桶名"
          key={form.key('bucketName')}
          {...form.getInputProps('bucketName')}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button type="submit">创建</Button>
        </div>
      </form>
    </Modal>
  )
}
