import { Link } from '@/router'
import { Button, Group, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

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

  return (
    <div className="mx-auto flex h-screen w-full max-w-xs flex-col items-center justify-center">
      <form
        onSubmit={form.onSubmit((values) => console.log(values))}
        className="fle  w-[30vw] min-w-[300px] rounded-md bg-white p-4 shadow-md"
      >
        <TextInput
          label="邮箱"
          placeholder="xxx@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="sm"
          label="密码"
          placeholder="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <TextInput
          mt="sm"
          label="验证码"
          key={form.key('code')}
          {...form.getInputProps('code')}
        />
        <Link
          to="/register"
          className="mt-4  text-xs	  text-gray-400 hover:text-gray-700"
        >
          没有账号？前往注册
        </Link>
        <Group justify="flex-end" mt="md">
          <Button type="submit">登录</Button>
        </Group>
      </form>
    </div>
  )
}
