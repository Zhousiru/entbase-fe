import { DoRequestWithErrorMessage } from '@/api'
import { AppLogo } from '@/components/app-logo'
import { Link } from '@/router'
import { Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
async function login(values: any) {
  await DoRequestWithErrorMessage(
    '/user/login',
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
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      code: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '请输入正确的邮箱'),
    },
  })
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data)
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
        onSubmit={form.onSubmit((values) =>
          loginMutation.mutate({ ...values }),
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
          placeholder="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <TextInput
          label="验证码"
          key={form.key('code')}
          {...form.getInputProps('code')}
        />
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
