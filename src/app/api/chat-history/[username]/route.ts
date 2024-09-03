import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const { username } = params

  try {
    const chatHistory = await prisma.chatMessages.findMany({
      where: { username },
      orderBy: { created_at: 'asc' },
    })

    return NextResponse.json(chatHistory, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching chat history', error },
      { status: 500 },
    )
  }
}
