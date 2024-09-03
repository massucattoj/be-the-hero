import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json()

    const user = await prisma.users.create({
      data: {
        username,
        email,
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user', error },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        username: true,
      },
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching users', error },
      { status: 500 },
    )
  }
}
