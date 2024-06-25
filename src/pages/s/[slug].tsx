import { $axios } from '@/api'
import { notificationError } from '@/constants/notifications'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function Page() {
  const params = new URL(location.href).searchParams
  const url = window.location.href
  const id = url || ''
  const password = params.get('password')

  // const [fileInfo, setFileInfo] = useState<{
  //   userId: number
  //   fileName: string
  //   userName: string
  //   endTime: string
  //   filePath: string
  // }>()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: password || '',
    },

    validate: {
      password: (value) => (value?.trim() == '' ? '请输入提取码' : null),
    },
  })
  const getFileMutation = useMutation({
    mutationFn: (v: string) =>
      $axios.post(`/share/get/${v}`, {}, { params: { password: v } }),

    onSuccess({ data }) {
      console.log(data)
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })
  const getFileInfoMutation = useMutation({
    mutationFn: (v: string) => $axios.post(`/share/get-info/${v}`, {}),

    onSuccess({ data }) {
      console.log(data)
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })
  useEffect(() => {
    getFileInfoMutation.mutate(id)
  }, [])
  return (
    <div className="relative flex w-full max-w-[700px] flex-row items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
      <div className="flex h-full w-[50%] flex-col gap-1 self-start">
        <div className="text-2xl">username</div>
        <div className="text-md font-light">fileName:</div>
        <div className="text-md font-light">filePath:</div>
        <div className="text-md font-light">endTime:</div>
      </div>
      <form
        onSubmit={form.onSubmit((values) =>
          getFileMutation.mutate(values.password),
        )}
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
  )
}
