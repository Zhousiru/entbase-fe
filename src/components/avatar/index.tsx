import defaultAvatar from '@/assets/default-avatar.webp'
import { apiConfig } from '@/config'
import { cn } from '@/utils/cn'
import { useState } from 'react'

export function Avatar({ id, className }: { id?: number; className?: string }) {
  const [showDefault, setShowDefault] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden rounded-full border', className)}
    >
      {showDefault ? (
        <img className="absolute inset-0 object-cover" src={defaultAvatar} />
      ) : (
        <img
          className={cn(
            'absolute inset-0 hidden object-cover',
            loaded && 'block',
          )}
          src={apiConfig.baseUrl + '/user/avatar/get/userId=' + id}
          onError={() => setShowDefault(true)}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}
