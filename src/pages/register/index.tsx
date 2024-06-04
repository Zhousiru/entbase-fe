import { $axios } from '@/api'
import { setToken } from '@/api/token'
import { ApiOk } from '@/api/types'
import { AppLogo } from '@/components/app-logo'
import { CaptchaImage, CaptchaImageRef } from '@/components/captcha-image'
import { notificationError } from '@/constants/notifications'
import {
  Alert,
  Button,
  LoadingOverlay,
  PasswordInput,
  PinInput,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconInfoCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

interface Fields {
  email: string
  password: string
  _confirmPassword: string
  imageCode: string
  emailCode: string
}

export default function Page() {
  const [stage, setStage] = useState<'fill' | 'verify' | 'done'>('verify')
  const captchaRef = useRef<CaptchaImageRef>(null)

  const form = useForm<Fields>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      _confirmPassword: '',
      imageCode: '',
      emailCode: '',
    },
    validate: {
      email: (value) => (!/^\S+@\S+$/.test(value) ? '请输入正确的邮箱' : null),
      _confirmPassword: (value, values) =>
        value !== values.password ? '密码不一致' : null,
    },
  })

  const getEmailCodeMutation = useMutation({
    mutationFn: (v: Fields) =>
      $axios.post<ApiOk<string>>('/user/get-email-code', {
        email: v.email,
        imageCode: v.imageCode,
        imageCodeId: captchaRef.current!.getCodeId(),
      }),
    onSuccess: () => {
      setStage('verify')
    },
    onError(e) {
      notifications.show({
        ...notificationError,
        message: e.message,
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (v: Fields) =>
      $axios.post<ApiOk<string>>('/user/register', {
        email: v.email,
        password: v.password,
        code: v.emailCode,
      }),
    onSuccess: ({ data }) => {
      setToken(data.data)
      setStage('done')
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
        <div className="text-lg font-light">注册</div>
      </div>

      <div className="relative flex w-full max-w-[350px] flex-col items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
        <form
          className="w-full"
          onSubmit={form.onSubmit((v) => {
            getEmailCodeMutation.mutate(v)
          })}
        >
          <LoadingOverlay
            visible={
              getEmailCodeMutation.isPending || registerMutation.isPending
            }
          />

          {stage === 'fill' && (
            <div className="flex flex-col gap-2">
              <TextInput
                label="邮箱"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput label="密码" {...form.getInputProps('password')} />
              <PasswordInput
                label="确认密码"
                {...form.getInputProps('_confirmPassword')}
              />

              <div className="flex items-end gap-1">
                <TextInput
                  className="flex-1"
                  label="验证码"
                  key={form.key('imageCode')}
                  {...form.getInputProps('imageCode')}
                />

                <CaptchaImage ref={captchaRef} />
              </div>

              <Button className="mt-4" variant="light" type="submit">
                下一步
              </Button>
            </div>
          )}

          {stage === 'verify' && (
            <div className="flex flex-col">
              <Alert color="blue" icon={<IconInfoCircle />} title="需要验证">
                验证邮件已发送至 {form.getValues().email}
              </Alert>
              <PinInput
                className="my-10 justify-center"
                length={6}
                type="number"
                key={form.key('emailCode')}
                {...form.getInputProps('emailCode')}
              />
              <Button onClick={() => registerMutation.mutate(form.getValues())}>
                注册
              </Button>
            </div>
          )}
        </form>

        {stage === 'done' && (
          <div className="flex w-full flex-col items-center p-8">
            <IconCheck size={48} stroke={1} className="text-blue-500" />
            <div className="mt-2 font-light">注册成功</div>
            <Button component={Link} to="/" className="mt-8">
              继续
            </Button>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </div>
    </div>
  )
}
