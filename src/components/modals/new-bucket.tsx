import { Modal } from '@mantine/core'

export function NewBucketModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="新增存储桶">
      TODO
    </Modal>
  )
}
