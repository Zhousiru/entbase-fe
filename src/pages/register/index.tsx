import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'

interface Fields {
  email: string
  password: string
  confirmPassword: string
  termsOfService: boolean
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

  return (
    <div className="mx-auto flex h-screen w-full max-w-xs flex-col items-center justify-center">
      <form
        onSubmit={form.onSubmit((values) => console.log(values))}
        className="flex w-full max-w-[400px] flex-col gap-2 rounded-md bg-white p-4 shadow-md"
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
      </form>
    </div>
  )
}
