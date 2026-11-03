'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserIcon, Github, Twitter, Twitch } from 'lucide-react'

const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'twitch', name: 'Twitch', icon: Twitch },
]

interface AvatarSelectorProps {
  onAvatarChange?: (url: string) => void
}

export default function AvatarSelector({
  onAvatarChange,
}: AvatarSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState('github')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Update avatar URL when platform or username changes
  useEffect(() => {
    if (selectedPlatform && username) {
      const url = `https://unavatar.io/${selectedPlatform}/${username}`
      setAvatarUrl(url)
      onAvatarChange?.(url)
    } else {
      setAvatarUrl('')
      onAvatarChange?.('')
    }
  }, [selectedPlatform, username, onAvatarChange])

  const selectedPlatformData = SOCIAL_PLATFORMS.find(
    (p) => p.id === selectedPlatform
  )

  return (
    <div className="flex min-w-0 max-w-full items-center">
      <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-input bg-card">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${username}'s ${selectedPlatformData?.name || 'social'} avatar`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <UserIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 ml-2">
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger aria-label="Social platform" className="w-[65px] shrink-0 rounded-r-none border-r-0 bg-card focus:ring-accent">
            {selectedPlatformData ? (
              <selectedPlatformData.icon className="w-4 h-4" />
            ) : (
              <SelectValue placeholder="Platform" />
            )}
          </SelectTrigger>
          <SelectContent className="border-input bg-card text-foreground">
            {SOCIAL_PLATFORMS.map((platform) => (
              <SelectItem key={platform.id} value={platform.id} className="focus:bg-background focus:text-accent">
                <div className="flex items-center gap-2">
                  <platform.icon className="w-4 h-4" />
                  <span>{platform.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          aria-label="Social username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="min-w-0 rounded-l-none flex-1 bg-card focus-visible:ring-accent"
        />
      </div>
    </div>
  )
}
