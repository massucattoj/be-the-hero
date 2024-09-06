'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/axios'
import { ArrowLineLeft } from 'phosphor-react'

interface ChatMessage {
  message: string
  author: string
  created_at: string
}

const ChatHistoryPage: React.FC = () => {
  const { username } = useParams()
  const [messages, setMessages] = useState<
    { text: string; type: 'bot' | 'user'; timestamp: Date }[]
  >([])
  const router = useRouter()

  useEffect(() => {
    if (!username) return

    const fetchChatHistory = async () => {
      try {
        const response = await api.get(`/chat-history/${username}`)

        // Map the response data to the format expected by messages state
        const formattedMessages = response.data.map((msg: ChatMessage) => ({
          text: msg.message,
          type: msg.author === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.created_at), // Convert ISO string to Date object
        }))

        setMessages(formattedMessages)
      } catch (error) {
        console.error('Error fetching chat history:', error)
      }
    }

    fetchChatHistory()
  }, [username])

  const formattedMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        formattedTime: message.timestamp.toLocaleTimeString(),
      })),
    [messages],
  )

  const handleBack = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-purple-100 to-gray-800 pt-[64px]">
      <div className="my-10 flex h-[calc(100vh-146px)] w-full max-w-4xl flex-col rounded-lg bg-gray-700 p-6 shadow-md">
        <button
          className="flex bg-transparent text-center text-purple-100 transition-colors duration-300 ease-in-out hover:text-gray-200 focus:outline-none"
          onClick={handleBack}
        >
          <ArrowLineLeft className="mr-2" width={24} height={24} />
          Back to Dashboard
        </button>
        <h1 className="mt-4 text-center text-2xl font-bold text-white">
          Chat History for {username}
        </h1>
        <hr className="my-4 w-full border-t border-white" />

        <div className="mt-4">
          {formattedMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-sm rounded-md p-3 ${message.type === 'user' ? 'bg-purple-700 text-white' : 'bg-gray-600 text-white'}`}
              >
                {message.text}
                <div className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatHistoryPage
