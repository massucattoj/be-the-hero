import React from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <div className="flex flex-col">
      <header className="fixed left-0 top-0 z-50 w-full bg-gray-800 bg-gradient-to-r from-purple-100 to-gray-800 p-4 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <Link href="/">bTheHero</Link>
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard">Login</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header
