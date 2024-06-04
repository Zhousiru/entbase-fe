import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { AppLogo } from '@/components/app-logo'
import { CaptchaImage } from '@/components/captcha-image'
import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  PinInput,
  Stepper,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface Fields {
  email: string
  password: string
  code: string
  confirmPassword: string
  termsOfService: boolean
}

interface Captcha {
  codeId: string
  base64: string
}

async function register(values: any) {
  await $axios.post<ApiOk<string>>('/user/register', {
    email: values.email,
    code: values.code,
    password: values.password,
  })
}
async function getCaptcha() {
  const res = await $axios.get<ApiOk<Captcha>>('/user/get-captcha', {})
  return res
}
async function getEmailCode(values: any) {
  const res = await $axios.post<ApiOk<string>>('/user/get-email-code', {
    ...values,
  })
  return res
}

export default function Page() {
  const [baseImg, setBaseImg] = useState<Captcha>({ base64: '', codeId: '' })
  const [active, setActive] = useState(0)
  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current))
  }
  const prevStep = () => setActive((current) => (current > 0 ? 0 : current))
  const [registerForm, setRegisterForm] = useState({
    email: '',
    code: '',
    password: '',
  })
  const form = useForm<Fields>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入正确的邮箱'),
      confirmPassword: (value, values) =>
        value !== values.password ? '请确认是否密码一致' : null,
    },
  })

  const getEmailCodeMutation = useMutation({
    mutationFn: getEmailCode,
    onSuccess: (res) => {
      // setBaseImg(res.data)
    },
  })
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      // console.log(data)
    },
  })

  return (
    <div className="mt-[20vh] flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <AppLogo />
        <div className="self-stretch border-l" />
        <div className="text-lg font-light">注册</div>
      </div>

      <div className="relative flex w-full max-w-[500px] flex-col items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="First step" description="Create an account">
            <form
              onSubmit={form.onSubmit((values) => {
                getEmailCodeMutation.mutate({
                  email: values.email,
                  imageCode: values.code,
                  imageCodeId: 'codeId',
                })
                setRegisterForm({
                  email: values.email,
                  password: values.password,
                  code: '',
                })
                nextStep()
              })}
            >
              <TextInput
                label="邮箱"
                placeholder="xxx@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="密码"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="确认密码"
                placeholder="Confirm password"
                key={form.key('confirmPassword')}
                {...form.getInputProps('confirmPassword')}
              />

              <div className="flex flex-row flex-nowrap  items-end gap-4 ">
                <TextInput
                  className="flex-1"
                  label="验证码"
                  key={form.key('code')}
                  {...form.getInputProps('code')}
                />

                <CaptchaImage></CaptchaImage>
              </div>
              <Checkbox
                label="阅读并接受《服务条款》和《隐私政策》"
                size="xs"
                key={form.key('termsOfService')}
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
              />
              <Group justify="center" mt="md">
                <Button type="reset" onClick={() => form.reset()}>
                  清空表单
                </Button>
                <Button type="submit">下一步</Button>
              </Group>
            </form>
          </Stepper.Step>

          <Stepper.Step label="Second step" description="Confirm Email code">
            <PinInput
              className="justify-center"
              length={6}
              onComplete={(value) => {
                setRegisterForm({
                  ...registerForm,
                  code: value,
                })
              }}
            />
            <Group justify="center" mt="md">
              <Button variant="default" onClick={prevStep}>
                重新开始
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  registerMutation.mutate(registerForm), nextStep()
                }}
              >
                注册
              </Button>
            </Group>
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </div>
    </div>
  )
}
