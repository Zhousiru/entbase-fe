import { cn } from '@/utils/cn'
import { RingProgress } from '@mantine/core'
import React from 'react'

export function RingProgressButton({
  className,
  progress,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & { progress: number | null }) {
  return (
    <div
      className={cn('relative grid h-12 w-12 place-items-center', className)}
    >
      <button
        className="grid h-full w-full place-items-center rounded-full bg-blue-500 text-white shadow-lg transition hover:-translate-y-1 disabled:bg-gray-400 disabled:hover:translate-y-0"
        disabled={!!progress || disabled}
        {...props}
      />
      <RingProgress
        className={cn(
          'pointer-events-none absolute opacity-0 transition',
          progress && 'opacity-100',
        )}
        size={66}
        thickness={4}
        sections={[{ value: progress ?? 0, color: 'blue' }]}
      />
    </div>
  )
}
