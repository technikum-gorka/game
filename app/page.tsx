import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import GameGrid from "@/components/game-grid";
import { games } from "@/lib/sample-data";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return redirect('/login');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 pixel-text text-amber-200">Featured Games</h1>
      <GameGrid games={games} />
    </main>
  );
}
