'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLineLeft, CaretDoubleUp } from 'phosphor-react'
import { api } from '@/lib/axios'
import { botResponses } from '@/utils/botResponses'

interface ChatMessage {
  message: string
  author: 'bot' | 'user'
}

const ChatPage: React.FC = () => {
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: `Welcome ${username}, how can I assist you today?`,
      author: 'bot',
    },
  ])

  const [input, setInput] = useState('')

  useEffect(() => {
    const sendInitialBotMessage = async () => {
      try {
        await api.post('/chat-messages', {
          username,
          message: `Welcome ${username}, how can I assist you today?`,
          author: 'bot',
        })
      } catch (error) {
        console.error('Error storing initial bot message:', error)
      }
    }

    sendInitialBotMessage()
  }, [username])

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    // Add user message
    setMessages([...messages, { message: input, author: 'user' }])
    setInput('')

    try {
      await api.post('/chat-messages', {
        username,
        message: input,
        author: 'user',
      })
    } catch (error) {
      console.error('Error storing message:', error)
    }

    // Simulate bot response
    const randomResponse =
      botResponses[Math.floor(Math.random() * botResponses.length)]
    setMessages([
      ...messages,
      { message: input, author: 'user' },
      { message: randomResponse, author: 'bot' },
    ])

    // Send bot message to API
    try {
      await api.post('/chat-messages', {
        username,
        message: randomResponse,
        author: 'bot',
      })
    } catch (error) {
      console.error('Error storing message:', error)
    }
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-purple-100 to-gray-800 pt-[64px]">
      <div className="my-10 flex h-[calc(100vh-146px)] w-full max-w-4xl flex-col rounded-lg bg-gray-700 p-6 shadow-md">
        <div className="flex-1 overflow-y-auto p-2 pt-12">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm rounded-md p-3 ${message.author === 'user' ? 'bg-purple-700 text-right' : 'bg-gray-600 text-left text-white'}`}
              >
                {message.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="mb-28" />
        </div>
        <div className="flex items-center border-t border-gray-300 pt-4">
          <textarea
            className="flex-1 resize-none rounded-md border border-gray-500 bg-gray-800 px-3 py-2 text-purple-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            rows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="ml-4 flex items-center rounded-md bg-gray-600 px-4 py-2 text-purple-100 shadow transition-colors duration-300 ease-in-out hover:bg-gray-500"
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
