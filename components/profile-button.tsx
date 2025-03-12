"use client"

import { User } from "lucide-react"
import { useSession } from "@/hooks/use-session"

interface ProfileButtonProps {
  onClick: () => void
}

export default function ProfileButton({ onClick }: ProfileButtonProps) {
  const session = useSession();

  const displayUser =  {
    name: session.user?.name,
    email: session.user?.email,
    avatar: session.user?.image,
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-700 transition-colors border border-amber-800"
    >
      <div className="w-8 h-8 rounded-md overflow-hidden bg-stone-700 flex items-center justify-center pixel-border-sm border border-amber-700">
        {displayUser.avatar ? (
          <img
            src={displayUser.avatar || "/placeholder.svg"}
            alt={displayUser.name}
            width={32}
            height={32}
            className="pixelated"
          />
        ) : (
          <User className="w-5 h-5 text-amber-200" />
        )}
      </div>
      <div className="hidden md:block text-left">
        <div className="text-xs font-medium pixel-text text-amber-200">{displayUser.name}</div>
        <div className="text-xs text-stone-400 truncate max-w-[120px]">{displayUser.email}</div>
      </div>
    </button>
  )
}

