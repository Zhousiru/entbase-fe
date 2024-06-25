import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { Button, Modal, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

function splitPath(path: string) {
  const index = path.lastIndexOf('/')
  return [path.substring(0, index + 1), path.substring(index + 1)]
}

export function RenameFileModal({
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
  const [newName, setNewName] = useState('')

  const [parent, filename] = splitPath(path)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!opened) return
    console.log(parent, filename)
    setNewName(filename)
  }, [filename, opened, parent, path])

  const mutation = useMutation({
    mutationFn: async () => {
      await $axios.post('/file/move', {
        bucketId,
        sourcePath: path,
        targetPath: parent + newName,
      })
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', bucketId],
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
    <Modal opened={opened} onClose={onClose} title="重命名文件">
      <TextInput value={newName} onChange={(e) => setNewName(e.target.value)} />

      <div className="mt-4 flex justify-end">
        <Button type="submit" onClick={() => mutation.mutate()}>
          更新
        </Button>
      </div>
    </Modal>
  )
}
