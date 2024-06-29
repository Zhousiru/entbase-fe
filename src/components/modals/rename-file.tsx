import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { getExt, gotoParentPath } from '@/utils/file'
import { Alert, Button, Modal, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

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
  bucketId?: number
  path: string
  opened: boolean
  onClose: () => void
}) {
  const [newName, setNewName] = useState('')
  const [extAlert, setExtAlert] = useState(false)

  const [parent, filename] = splitPath(path)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!opened) return
    setNewName(filename)
    setExtAlert(false)
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
        queryKey: ['bucket-list', bucketId, gotoParentPath(path)],
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

  function handleChangeNewName(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setNewName(value)
    if (getExt(value) === getExt(path)) {
      setExtAlert(false)
    } else {
      setExtAlert(true)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="重命名文件">
      <TextInput
        label="新文件名"
        value={newName}
        onChange={handleChangeNewName}
      />

      {extAlert && (
        <Alert color="orange" icon={<IconAlertCircle />} className="mt-2">
          改变拓展名可能会导致文件不可用
        </Alert>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="submit" onClick={() => mutation.mutate()}>
          更新
        </Button>
      </div>
    </Modal>
  )
}
