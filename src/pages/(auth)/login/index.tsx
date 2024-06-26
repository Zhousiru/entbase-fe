import { $axios } from '@/api'
import { setToken } from '@/api/token'
import { ApiOk } from '@/api/types'
import { AppLogo } from '@/components/app-logo'
import { CaptchaImage, CaptchaImageRef } from '@/components/captcha-image'
import { notificationError } from '@/constants/notifications'
import { Link } from '@/router'
import { Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Fiedls {
  email: string
  password: string
  imageCode: string
}

export default function Page() {
  const form = useForm<Fiedls>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      imageCode: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入正确的邮箱'),
    },
  })
  const captchaRef = useRef<CaptchaImageRef>(null)

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (values: Fiedls) =>
      $axios.post<ApiOk<string>>('/login', {
        ...values,
        imageCodeId: captchaRef.current!.getCodeId(),
      }),
    onSuccess({ data }) {
      setToken(data.data)
      navigate('/')
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  return (
    <div className="mt-[20vh] flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <AppLogo />
        <div className="self-stretch border-l" />
        <div className="text-lg font-light">登录</div>
      </div>
      <form
        onSubmit={form.onSubmit((v) => loginMutation.mutate(v))}
        className="relative flex w-full max-w-[350px] flex-col gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md"
      >
        <TextInput
          label="邮箱"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="密码"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <div className="flex gap-1">
          <TextInput
            className="flex-grow"
            label="验证码"
            key={form.key('imageCode')}
            {...form.getInputProps('imageCode')}
          />
          <CaptchaImage ref={captchaRef} className="self-end" />
        </div>

        <Link to="/register" className="text-xs opacity-50 hover:opacity-75">
          没有账号？前往注册
        </Link>

        <Group justify="flex-end" mt="md">
          <Button type="submit">登录</Button>
        </Group>

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </form>
    </div>
  )
}
