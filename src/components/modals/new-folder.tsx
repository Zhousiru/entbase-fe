import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { joinPaths } from '@/utils/file'
import { Button, Modal, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function NewFolderModal({
  bucketId,
  path,
  opened,
  onClose,
}: {
  bucketId: number
  path: string
  opened: boolean
  onClose: () => void
}) {
  const [newFolderName, setNewFolderName] = useState('')

  const queryClient = useQueryClient()

  useEffect(() => {
    opened && setNewFolderName('')
  }, [opened])

  const mutation = useMutation({
    mutationFn: async () => {
      await $axios.post(
        '/file/create-dir',
        {},
        {
          params: {
            bucketId,
            path: joinPaths(path, newFolderName),
          },
        },
      )
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId, path],
      })
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
    <Modal opened={opened} onClose={onClose} title="新建文件夹">
      <TextInput
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
      />

      <div className="mt-4 flex justify-end">
        <Button type="submit" onClick={() => mutation.mutate()}>
          创建
        </Button>
      </div>
    </Modal>
  )
}
