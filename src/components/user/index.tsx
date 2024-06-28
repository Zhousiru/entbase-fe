import { $axios } from '@/api'
import { getTokenWithPayload, setToken } from '@/api/token'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Button, FileInput, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../avatar'
export default function UserView() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      newName: '',
    },

    validate: {
      // newName: (value) => (value.trim() === '' ? null : '用户名不能为空'),
    },
  })
  const navigate = useNavigate()

  const updateNameMutate = useMutation({
    mutationFn: (values: string) =>
      $axios.post<ApiOk<string>>(
        '/user/modify-name',
        {},
        { params: { newName: values } },
      ),
    onSuccess({ data }) {
      console.log(data)
      setToken('')
      navigate('/')
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  const updateAvatarMutate = useMutation({
    mutationFn: (values: File | null) =>
      $axios.post<ApiOk<File>>(`/user/avatar/upload`, {
        data: { newIcon: values },
      }),
    onSuccess({ data }) {
      console.log(data)
      setToken('')
      navigate('/')
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  const updateName = (newName: string) => {
    updateNameMutate.mutate(newName)
    updateAvatarMutate.mutate(avatar)
  }
  const [avatar, setAvatar] = useState<File | null>(null)

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          updateName(values.newName)
        })}
      >
        <Avatar id={getTokenWithPayload()[1].userId} className="h-24 w-24" />
        <FileInput value={avatar} onChange={setAvatar} />

        <TextInput
          withAsterisk
          label="newName"
          key={form.key('newName')}
          {...form.getInputProps('newName')}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </>
  )
}
