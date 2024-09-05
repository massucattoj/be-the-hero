'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLineLeft, CaretDoubleUp } from 'phosphor-react'
import { api } from '@/lib/axios'
import { getRandomBotResponse } from '@/utils/getBotResponse'

interface ChatMessage {
  message: string
  author: 'bot' | 'user'
}

const ChatPage: React.FC = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: `🚀 Heeey ${username}! 👋 I'm here to assist you. Tell me what do you need to be your own hero? 🥷`,
      author: 'bot',
    },
  ])

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const simulatedBotMessage = async () => {
    const randomResponse = getRandomBotResponse()

    // Add bot message
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: randomResponse, author: 'bot' },
    ])

    try {
      // Store the simulated bot message
      await api.post('/chat-messages', {
        username,
        message: randomResponse,
        author: 'bot',
      })
    } catch (error) {
      console.error('Error storing bot message:', error)
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: input, author: 'user' },
    ])

    const userMessage = input
    setInput('')

    try {
      await api.post('/chat-messages', {
        username,
        message: userMessage,
        author: 'user',
      })
    } catch (error) {
      console.error('Error storing message:', error)
    }

    if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      // Fetch bot response from API
      try {
        const response = await api.post('/messages', {
          message: userMessage,
        })
        const botMessage = response.data.botMessage

        // Add bot message
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: botMessage, author: 'bot' },
        ])

        // Store bot message
        await api.post('/chat-messages', {
          username,
          message: botMessage,
          author: 'bot',
        })
      } catch (error) {
        console.error('Error fetching bot response:', error)

        // If an error occurs fallback to the simulated bot message
        simulatedBotMessage()
      }
    } else {
      simulatedBotMessage()
    }
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-purple-100 to-gray-800 pt-[64px]">
      <div className="my-10 flex h-[calc(100vh-146px)] w-full max-w-4xl flex-col rounded-lg bg-gray-700 p-4 shadow-md md:p-6">
        <div className="flex-1 overflow-y-auto p-2 pt-12">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                message.author === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm rounded-md p-3 ${
                  message.author === 'user'
                    ? 'bg-purple-700 text-right'
                    : 'bg-gray-600 text-left text-white'
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="mb-28" />
        </div>
        <div className="flex flex-col items-center space-y-4 border-t border-gray-300 pt-4 md:flex-row md:space-x-4 md:space-y-0">
          <textarea
            className="flex-1 resize-none rounded-md border border-gray-500 bg-gray-800 px-3 py-2 text-purple-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            rows={3}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="flex items-center rounded-md bg-gray-600 px-4 py-2 text-purple-100 shadow transition-colors duration-300 ease-in-out hover:bg-gray-500"
            onClick={handleSendMessage}
          >
            Send
            <CaretDoubleUp className="ml-2" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="flex items-center bg-transparent text-purple-100 transition-colors duration-300 ease-in-out hover:text-gray-200 focus:outline-none"
            onClick={handleExit}
          >
            <ArrowLineLeft className="mr-2" width={24} height={24} />
            <span className="text-lg font-semibold">Exit chat</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
