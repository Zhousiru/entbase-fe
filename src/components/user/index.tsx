import { $axios } from '@/api'
import { getTokenWithPayload, setToken } from '@/api/token'
import { ApiOk } from '@/api/types'
import { notificationError } from '@/constants/notifications'
import { Button, TextInput, Tooltip } from '@mantine/core'
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
        value.trim() === '' ||
        value.trim() === getTokenWithPayload()[1].username
          ? '请确保用户名不为空且与先前用户名不同'
          : null,
    },
  })
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateNameMutation = useMutation({
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

  const updateAvatarMutation = useMutation({
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
    updateNameMutation.mutate(newName)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex max-w-[350px] flex-col">
      <Tooltip withArrow position="right" label="点击上传新头像">
        <div className="h-24 w-24 rounded-full" onClick={handleAvatarClick}>
          <Avatar
            id={getTokenWithPayload()[1].userId}
            className="h-24 w-24 cursor-pointer"
          />
        </div>
      </Tooltip>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            updateAvatarMutation.mutate(e.target.files[0])
          }
        }}
      />

      <form
        onSubmit={form.onSubmit((values) => {
          updateName(values.newName)
        })}
        className="mt-2"
      >
        <TextInput
          label="用户名"
          key={form.key('newName')}
          {...form.getInputProps('newName')}
          className="w-[250px]"
        />

        <div className="mt-2">
          <Button type="submit" size="xs">
            提交
          </Button>
        </div>
      </form>
    </div>
  )
}
