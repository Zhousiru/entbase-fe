import { cn } from '@/utils/cn'
import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconDatabaseSmile,
  IconHome,
  IconLink,
  IconLogout,
  IconSettings,
  IconShare,
} from '@tabler/icons-react'
import { ReactNode } from 'react'
import { NavLink, Outlet, To } from 'react-router-dom'

import avatarImage from '@/assets/avatar.jpg'

function MenuLink({
  to,
  className,
  children,
}: {
  to: To
  className?: string
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex h-12 items-center gap-2 px-4 font-light transition',
          isActive && 'bg-blue-500/10 text-blue-500',
          className,
        )
      }
    >
      {children}
    </NavLink>
  )
}

export default function Layout() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header className="flex items-center gap-4 px-4">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div className="flex items-center gap-2">
            <IconDatabaseSmile
              size={36}
              stroke={1.2}
              className="text-blue-500"
            />
            <div className="font-comfortaa text-2xl font-semibold">
              entbase
              <span className="text-blue-500">.</span>
            </div>
          </div>
        </AppShell.Header>

        <AppShell.Navbar className="flex flex-col">
          <div className="flex items-center gap-2 border-b p-4">
            <div className="flex-grow leading-tight">
              <div className="opacity-50">Hi,</div>
              <div className="text-2xl">Cirno</div>
            </div>
            <div className="rela relative aspect-square h-full flex-shrink-0">
              <img
                className="absolute inset-0 rounded-full border object-cover"
                src={avatarImage}
              />
            </div>
          </div>

          <MenuLink to="/my">
            <IconHome stroke={1} /> 我的空间
          </MenuLink>
          <MenuLink to="/buckets">
            <IconShare stroke={1} /> 共享空间
          </MenuLink>
          <MenuLink to="/shared-links">
            <IconLink stroke={1} /> 共享链接
          </MenuLink>
          <MenuLink to="/settings">
            <IconSettings stroke={1} /> 设置
          </MenuLink>

          <button className="mt-auto flex h-12 items-center gap-2 border-t px-4 font-light">
            <IconLogout stroke={1} /> 登出
          </button>
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  )
}
