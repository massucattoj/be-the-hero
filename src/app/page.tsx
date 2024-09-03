'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'

const userFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'User must have at least 3 letters.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'The user can only have letters and hyphens.',
    }),
  email: z.string().email('Invalid email address.'),
})

type UserFormValues = z.infer<typeof userFormSchema>

const HomePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  })

  const router = useRouter()

  const handleSubmitUserData = async (data: UserFormValues) => {
    try {
      await api.post('/users', {
        username: data.username,
        email: data.email,
      })

      router.push(`/chat-messages?username=${data.username}`)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-100 to-gray-800 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-gray-700 p-6 shadow-md sm:p-8">
        <h1 className="mb-4 text-center text-4xl font-bold text-white sm:text-5xl">
          be The Hero
        </h1>
        <p className="mb-8 text-center text-base text-purple-100 sm:text-lg">
          Don&#39;t wait for someone else to light your path. Be the hero of
          your own story and create your own light.
        </p>

        <form
          onSubmit={handleSubmit(handleSubmitUserData)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="block text-sm font-medium text-purple-100">
              Username
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register('username')}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-100">
              Email
              <input
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-gray-600 px-4 py-2 text-purple-100 shadow transition-colors duration-300 ease-in-out hover:bg-gray-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Start conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HomePage
