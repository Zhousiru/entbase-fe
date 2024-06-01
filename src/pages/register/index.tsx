import { DoRequestWithErrorMessage } from '@/api'
import { AppLogo } from '@/components/app-logo'
import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'

interface Fields {
  email: string
  password: string
  confirmPassword: string
  termsOfService: boolean
}

async function register(values: any) {
  await DoRequestWithErrorMessage(
    '/user/register',
    'post',
    {
      email: values.email,
      code: values.code,
      password: values.password,
    },
    false,
  )
}

export default function Page() {
  const form = useForm<Fields>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
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
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      console.log(data)
    },
  })
  return (
    <div className="mt-[20vh] flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <AppLogo />
        <div className="self-stretch border-l" />
        <div className="text-lg font-light">注册</div>
      </div>
      <form
        onSubmit={form.onSubmit((values) =>
          registerMutation.mutate({ ...values }),
        )}
        className="relative flex w-full max-w-[400px] flex-col gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md"
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
        <Checkbox
          label="阅读并接受《服务条款》和《隐私政策》"
          size="xs"
          key={form.key('termsOfService')}
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">注册</Button>
        </Group>

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </form>
    </div>
  )
}
