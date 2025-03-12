import type { User as BetterAuthUser } from 'better-auth/types'

export interface User extends BetterAuthUser {}

export interface Game {
    id: string
    title: string
    description: string
    image?: string
    category: string
    author: string
    isFavorite?: boolean
  }
