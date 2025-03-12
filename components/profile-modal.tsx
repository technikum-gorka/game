"use client"

import { useState, useEffect } from "react"
import { X, LogOut, Settings, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "@/hooks/use-session"
import Link from "next/link"

interface ProfileModalProps {
  onClose: () => void
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  // const [user] = useState({
  //   name: "Sir Knight",
  //   email: "knight@realm.games",
  //   avatar: "/placeholder.svg?height=80&width=80&text=🛡️",
  //   level: 12,
  //   experience: 75, // percentage
  //   stats: {
  //     strength: 14,
  //     dexterity: 16,
  //     constitution: 12,
  //     intelligence: 10,
  //     wisdom: 8,
  //     charisma: 15,
  //   },
  //   cosmetics: [
  //     { id: 1, name: "Iron Helmet", type: "head", rarity: "common" },
  //     { id: 2, name: "Knight's Armor", type: "body", rarity: "uncommon" },
  //     { id: 3, name: "Leather Boots", type: "feet", rarity: "common" },
  //     { id: 4, name: "Steel Shield", type: "offhand", rarity: "uncommon" },
  //     { id: 5, name: "Royal Cape", type: "back", rarity: "rare" },
  //     { id: 6, name: "Golden Crown", type: "head", rarity: "epic" },
  //     { id: 7, name: "Wizard Hat", type: "head", rarity: "rare" },
  //     { id: 8, name: "Chainmail", type: "body", rarity: "common" },
  //     { id: 9, name: "Enchanted Gloves", type: "hands", rarity: "rare" },
  //   ],
  // })

    const session = useSession();
  
    const displayUser =  {
      name: session.user?.name,
      email: session.user?.email,
      avatar: session.user?.image,
    }

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-stone-600"
      case "uncommon":
        return "bg-olive-600"
      case "rare":
        return "bg-blue-900"
      case "epic":
        return "bg-amber-600"
      default:
        return "bg-stone-600"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div
        className="bg-stone-900 text-stone-200 rounded-lg w-full max-w-3xl border-2 border-amber-800 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-stone-700">
          <h2 className="text-xl font-bold pixel-text text-amber-200">Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-stone-800 text-stone-400">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-amber-700 bg-stone-800 flex items-center justify-center">
              <img src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} className="pixelated" />
            </div>
            <div>
              <h3 className="text-lg font-bold pixel-text text-amber-200">{displayUser.name}</h3>
              <p className="text-stone-400 text-sm">{displayUser.email}</p>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs pixel-text text-amber-700">Level 
                    {/* {user.level} */}
                    10
                    </span>
                  <span className="text-xs pixel-text text-amber-700">
                    {/* {user.experience} */}
                    90
                    %</span>
                </div>
                <Progress 
                // value={displayUser.experience} 
                value={600}
                className="h-2 bg-stone-700 custom-progress-amber" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="character" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-stone-800 border border-amber-800">
              <TabsTrigger
                value="character"
                className="pixel-text data-[state=active]:bg-amber-900 data-[state=active]:text-amber-200"
              >
                My Character
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="pixel-text data-[state=active]:bg-amber-900 data-[state=active]:text-amber-200"
              >
                Favorites
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="pixel-text data-[state=active]:bg-amber-900 data-[state=active]:text-amber-200"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="character" className="space-y-6">
              <div className="bg-stone-800 p-3 rounded-lg border border-amber-800">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium pixel-text text-amber-200 mb-3">Character Appearance</h4>
                    <div className="flex justify-center">
                      <div className="w-40 h-40 bg-stone-700 rounded-lg border border-amber-700 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=150&width=150&text=Character"
                          alt="Character"
                          className="pixelated"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium pixel-text text-amber-200">Owned Cosmetics</h4>
                      <span className="bg-amber-900 text-stone-100 px-2 py-1 rounded-md text-xs border border-amber-700">
                        {/* {user.cosmetics.length} */}
                        10
                      </span>
                    </div>

                    <ScrollArea className="h-40 rounded-md border border-amber-700">
                      <div className="p-2 space-y-2">
                        {/* {user.cosmetics.map((item) => ( */}
                          <div
                            // key={item.id}
                            className="flex items-center p-2 rounded-md bg-stone-700 hover:bg-stone-600 cursor-pointer"
                          >
                            <div className={`w-3 h-3 rounded-full mr-2 ${getRarityColor("rare")}`}></div>
                            <div className="flex-1">
                              <div className="text-sm pixel-text text-amber-200">
                                {/* {item.name} */}
                                item.name
                              </div>
                              <div className="text-xs text-stone-400 capitalize">
                                {/* {item.type} */}
                                item.type
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-amber-900/50">
                              Equip
                            </Button>
                          </div>
                        {/* ))} */}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              <div className="bg-stone-800 p-3 rounded-lg border border-amber-800">
                <h4 className="font-medium pixel-text text-amber-200 mb-3">Character Stats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">💪</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Strength</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.strength"}</span>
                      </div>
                      <Progress
                        // value={user.stats.strength * 5}
                        className="h-2 bg-stone-700 custom-progress-red"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Attack, lifting, breaking, carrying</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">🏃</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Dexterity</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.dexterity"}</span>
                      </div>
                      <Progress
                        // value={user.stats.dexterity * 5}
                        className="h-2 bg-stone-700 custom-progress-olive"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Dodge, accuracy, acrobatics</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">❤️</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Constitution</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.constitution"}</span>
                      </div>
                      <Progress
                        // value={user.stats.constitution * 5}
                        className="h-2 bg-stone-700 custom-progress-red"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Health, resistance, stamina</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">🧠</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Intelligence</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.intelligence"}</span>
                      </div>
                      <Progress
                        // value={user.stats.intelligence * 5}
                        className="h-2 bg-stone-700 custom-progress-indigo"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Magic, puzzles, learning</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">🔮</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Wisdom</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.wisdom"}</span>
                      </div>
                      <Progress
                        // value={user.stats.wisdom * 5}
                        className="h-2 bg-stone-700 custom-progress-blue"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Perception, instinct, intuition</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 flex-shrink-0 text-center">🗣</div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm pixel-text">Charisma</span>
                        <span className="text-sm pixel-text text-amber-700">{"user.stats.charisma"}</span>
                      </div>
                      <Progress
                        // value={user.stats.charisma * 5}
                        className="h-2 bg-stone-700 custom-progress-amber"
                      />
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">Persuasion, trading, leadership</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium pixel-text text-amber-200">Favorite Games</h4>
                <span className="bg-amber-900 text-stone-100 px-2 py-1 rounded-md text-xs border border-amber-700">
                  12
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((game) => (
                  <div
                    key={game}
                    className="aspect-square bg-stone-800 rounded-md flex items-center justify-center border border-amber-800 relative"
                  >
                    <img
                      src={`/placeholder.svg?height=80&width=80&text=Game${game}`}
                      alt={`Game ${game}`}
                      className="pixelated"
                    />
                    <Heart className="absolute top-1 right-1 w-4 h-4 text-red-700 fill-red-700" />
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full pixel-text border-amber-800 hover:bg-amber-900 hover:text-amber-200"
              >
                View All Favorites
              </Button>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-amber-800 hover:bg-amber-900 hover:text-amber-200"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="pixel-text">Edit Profile</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-amber-800 hover:bg-amber-900 hover:text-amber-200"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="pixel-text">Account Settings</span>
                </Button>
                <Link href="/logout">
                  <Button
                  onClick={onClose}
                    variant="outline"
                    className="w-full justify-start text-red-700 hover:text-red-600 border-red-900 hover:bg-red-900/30"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="pixel-text">Logout</span>
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
