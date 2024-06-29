import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { Avatar } from '@/components/avatar'
import { notificationError } from '@/constants/notifications'
import { formatDate } from '@/utils/date'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { useParams } from 'react-router-dom'

export default function Page() {
  const params = useParams()
  const id = params.id!

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },

    validate: {
      password: (value) => (value?.trim() == '' ? '请输入提取码' : null),
    },
  })

  const { isSuccess, isError, data } = useQuery({
    queryKey: ['share-info', id],
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
    retry: false,
  })

  const getFile = (password: string) => {
    const href = `/share/get/${id}/pwd=${password}`
    $axios
      .get(href, {
        params: { password },
        responseType: 'blob',
      })
      .then((res) => {
        saveAs(res.data, data?.data.data.fileName)
      })
      .catch(() => {
        notifications.show({
          ...notificationError,
          message: '密码错误',
        })
      })
  }

  return (
    <>
      {isSuccess && (
        <div className="flex w-full max-w-[700px] flex-row items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
          <div className="flex w-[50%] flex-col gap-2">
            <div className="flex items-center gap-2 text-2xl">
              <Avatar id={data.data.data.userId} className="h-10 w-10" />
              {data.data.data.userName}
            </div>
            <div className="text font-light">
              向你共享了 {data.data.data.fileName}
            </div>
            <div className="mt-auto text-sm font-light opacity-50">
              过期时间：{formatDate(data.data.data.endTime)}
            </div>
          </div>
          <form
            onSubmit={form.onSubmit((values) => getFile(values.password))}
            className="w-[50%] border-l border-gray-200 p-4	"
          >
            <TextInput
              className="w-full"
              label="提取码"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">提取</Button>
            </Group>
          </form>
        </div>
      )}
      {isError && <div className="text-center text-2xl">文件不存在</div>}
    </>
  )
}
