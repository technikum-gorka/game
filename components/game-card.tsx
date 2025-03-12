import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { Game } from "@/lib/types"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-stone-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 border-2 border-amber-800">
        <div className="relative aspect-video">
          <Image
            src={"/"}
            alt={game.title}
            fill
            className="object-cover pixelated"
          />
          <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-red-900/80 transition-colors border border-amber-700">
            <Heart className={`w-4 h-4 ${game.isFavorite ? "text-red-700 fill-red-700" : "text-stone-200"}`} />
            <span className="sr-only">Favorite</span>
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-amber-200 mb-1 pixel-text">{game.title}</h3>
          <p className="text-stone-300 text-sm line-clamp-2">{game.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs bg-stone-700 text-amber-200 px-2 py-1 rounded border border-amber-700">
              {game.category}
            </span>
            <span className="text-xs text-stone-400">by {game.author}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

