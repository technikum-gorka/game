import GameCard from "./game-card"
import type { Game } from "@/lib/types"

interface GameGridProps {
  games: Game[]
}

export default function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

