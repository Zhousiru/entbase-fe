import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const params = new URL(location.href).searchParams
  const url = window.location.href.match(/\/s\/([^?]+)/) || ''
  const id = url[1]
  const password = params.get('password')

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: password || '',
    },

    validate: {
      password: (value) => (value?.trim() == '' ? '请输入提取码' : null),
    },
  })

  const { isSuccess, data } = useQuery({
    queryKey: ['bucket-list'],
    queryFn: () =>
      $axios.post<
        ApiOk<{
          userId: number
          fileName: string
          userName: string
          endTime: string
          filePath: string
        }>
      >(`/share/get-info/${id}`),
  })
  const getFile = (password: string) => {
    const href = `/share/get/${id}/pwd=${password}`
    $axios
      .get(href, {
        params: { password },
        responseType: 'blob',
      })
      .then((res) => {
        const _data = res.data
        const url = window.URL.createObjectURL(
          new Blob([_data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        )
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', data?.data.data.fileName || '未命名')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((e) => {
        notifications.show({
          ...notificationError,
          message: e.message,
        })
      })
  }

  return (
    <>
      {isSuccess ? (
        <div className="relative flex w-full max-w-[700px] flex-row items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
          <div className="flex h-full w-[50%] flex-col gap-2 self-start">
            <div className="text-2xl">共享用户：{data?.data.data.userName}</div>
            <div className="text-sm font-light">
              文件：{data?.data.data.fileName}:
            </div>
            <div className="text-sm font-light">
              路径：{data?.data.data.filePath}:
            </div>
            <div className="text-sm font-light">
              有效截止时间：{data?.data.data.endTime}:
            </div>
          </div>
          <form
            onSubmit={form.onSubmit((values) => getFile(values.password))}
            className="w-[50%] border-l border-gray-200 p-4	"
          >
            <TextInput
              className="w-full"
              label="提取码:"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">提取</Button>
            </Group>
          </form>
        </div>
      ) : (
        <div className="text-center text-2xl ">文件不存在</div>
      )}
    </>
  )
}
