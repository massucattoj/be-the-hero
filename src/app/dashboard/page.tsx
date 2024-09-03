import React from 'react'
import { api } from '@/lib/axios'

interface User {
  username: string
}

async function fetchUsers(): Promise<User[]> {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch users')
  }
}

const DashboardPage = async () => {
  const users = await fetchUsers()

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
