import { $axios } from '@/api'
import { getTokenWithPayload, setToken } from '@/api/token'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../avatar'

export default function UserView() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      newName: getTokenWithPayload()[1].username,
    },

    validate: {
      newName: (value) =>
        value.trim() === '' || getTokenWithPayload()[1].username
          ? '请确保用户名不为空且与先前用户名不同'
          : null,
    },
  })
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    mutationFn: (values: File | null) => {
      const formData = new FormData()
      if (values) {
        formData.append('newIcon', values)
      }
      return $axios.post<ApiOk<File>>(`/user/avatar/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess({ data }) {
      console.log(data)
      location.reload()
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
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={handleAvatarClick}
      >
        <Avatar
          id={getTokenWithPayload()[1].userId}
          className="h-24 w-24 cursor-pointer"
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) {
              updateAvatarMutate.mutate(e.target.files[0])
            }
          }}
        />
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          updateName(values.newName)
        })}
        style={{ marginTop: '20px' }}
      >
        <TextInput
          label="用户名："
          key={form.key('newName')}
          {...form.getInputProps('newName')}
          style={{ marginBottom: '10px' }}
          className="text-gray-500 focus:text-gray-950 "
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">提交</Button>
        </Group>
      </form>
    </div>
  )
}
