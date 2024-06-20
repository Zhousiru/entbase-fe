import { Modal } from '@mantine/core'

export function EditBucketModal({
  id,
  opened,
  onClose,
}: {
  id: number
  opened: boolean
  onClose: () => void
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="编辑存储桶">
      ID {id} TODO
      {/* 可以在最后加一个按钮，点击删除这个存储桶 */}
    </Modal>
  )
}
