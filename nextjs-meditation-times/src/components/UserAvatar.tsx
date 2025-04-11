import Image from 'next/image'
import { User } from '@/sanity/schemas/user'

interface UserAvatarProps {
  user?: Pick<User, 'name' | 'avatar'>
  size?: number
  className?: string
}

export default function UserAvatar({ user, size = 120, className = '' }: UserAvatarProps) {
  const avatarUrl = user?.avatar?.asset?.url
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U'

  return (
    <div 
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          width={size}
          height={size}
          alt={user?.name || 'User avatar'}
          className="object-cover w-full h-full"
        />
      ) : (
        <span 
          className="text-gray-500 font-medium"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}