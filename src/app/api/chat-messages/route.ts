import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, message, author } = await req.json()

    const chatMessage = await prisma.chatMessages.create({
      data: {
        username,
        message,
        author,
      },
    })

    return NextResponse.json(
      { message: 'Chat message stored successfully', chatMessage },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error storing chat message', error },
      { status: 500 },
    )
  }
}
