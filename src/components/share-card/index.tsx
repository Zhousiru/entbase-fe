import { $axios } from '@/api'
import { getValidTokenPayload } from '@/api/token'
import { notificationError } from '@/constants/notifications'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
export function ShareCard({
  name,
  startTime,
  endTime,
  filePath,
  shareId,
}: {
  name: string
  startTime: string
  endTime: string
  filePath: string
  shareId: string
}) {
  const queryClient = useQueryClient()

  const deleteShareMutation = useMutation({
    mutationFn: (v: string) => $axios.post(`/share/delete/${v}`, {}),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['share-list'] })
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  return (
    <div className="text-md flex flex-row justify-between gap-6 rounded border p-6 text-gray-600 transition hover:shadow-lg">
      <div>
        <div className="font-black ">
          文件名：
          {name ? name : '未命名'}
        </div>
        <div>文件路径：{filePath}</div>
      </div>
      <div className="flex flex-1 flex-col gap-6 self-end text-sm">
        {getValidTokenPayload().isAdmin && (
          <button
            type="button"
            className=" self-end border-none text-sm text-red-500 hover:text-red-400"
            onClick={() => deleteShareMutation.mutate(shareId)}
          >
            删除
          </button>
        )}
        <div className="flex flex-row flex-nowrap gap-6 self-end text-sm ">
          <div>起始时间：{startTime}</div>
          <div>结束时间：{endTime}</div>
        </div>
      </div>
    </div>
  )
}
