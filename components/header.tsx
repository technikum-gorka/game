"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ShoppingCart } from "lucide-react"
import ProfileButton from "./profile-button"
import ProfileModal from "./profile-modal"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-stone-800 text-stone-200 border-b-2 border-amber-700 h-16 sticky top-0 w-full z-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 mr-2 pixelated">
                <img src="/placeholder.svg?height=32&width=32&text=⚔️" alt="Logo" className="pixelated" />
              </div>
              <span className="text-xl font-medium tracking-wide pixel-text text-amber-200">REALM GAMES</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-amber-200 transition-colors pixel-text text-sm flex items-center">
                    Home
                  </Link>
                </li>
                {/* <li>
                  <Link href="/categories" className="hover:text-amber-200 transition-colors pixel-text text-sm flex items-center">
                    Categories
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-amber-200 transition-colors pixel-text text-sm flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shop
                  </Link>
                </li>
              </ul>
            </nav>

            <ProfileButton onClick={() => setIsModalOpen(true)} />

            <button className="ml-2 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  href="/"
                  className="block hover:text-amber-200 transition-colors pixel-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="block hover:text-amber-200 transition-colors pixel-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="block hover:text-amber-200 transition-colors pixel-text flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Shop
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {isModalOpen && <ProfileModal onClose={() => setIsModalOpen(false)} />}
    </header>
  )
}

