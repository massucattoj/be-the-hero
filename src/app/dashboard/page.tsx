'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/lib/axios'

interface User {
  username: string
}

const DashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        setUsers(response.data)
      } catch (error) {
        setError('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-purple-100 to-gray-800 pt-[64px]">
      <div className="my-10 flex h-[calc(100vh-146px)] w-full max-w-4xl flex-col rounded-lg bg-gray-700 p-6 shadow-md sm:p-8">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Admin Dashboard - Users List
        </h1>

        <hr className="my-4 w-full border-t border-white" />

        <ul className="mt-4">
          {users.map((user) => (
            <li key={user.username} className="mb-2">
              <a
                href={`/chat-history/${user.username}`}
                className="text-blue-500 hover:underline"
              >
                {user.username}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DashboardPage
