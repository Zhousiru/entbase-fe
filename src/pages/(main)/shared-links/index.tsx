import { $axios } from '@/api'
import { getValidTokenPayload } from '@/api/token'
import { ApiOk } from '@/api/types'
import { DeleteShareModal } from '@/components/modals/delete-share'
import { ShareCard } from '@/components/share-card'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
export default function Page() {
  const { isSuccess, data } = useQuery({
    queryKey: ['share-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<
          Array<{
            fileName: string
            startTime: string
            endTime: string
            filePath: string
            shareId: string
          }>
        >
      >('/share/list'),
  })

  const deleteModal = useDisclosure()

  return (
    <>
      <div className="relative flex flex-col gap-4 p-4">
        {isSuccess &&
          data.data.data.map((item) => (
            <ShareCard
              name={item.fileName}
              key={item.shareId}
              startTime={item.startTime}
              endTime={item.endTime}
              filePath={item.filePath}
            />
          ))}
      </div>

      <DeleteShareModal
        opened={deleteModal[0]}
        onClose={deleteModal[1].close}
      />

      {getValidTokenPayload().isAdmin && (
        <div className="fixed bottom-4 right-4 flex gap-4">
          <button
            onClick={deleteModal[1].open}
            className="bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-red-500 text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
          >
            <IconTrash />
          </button>
        </div>
      )}
    </>
  )
}
