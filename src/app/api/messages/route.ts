import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Send request to OpenAI API
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      },
    )

    const botMessage = openAiResponse.data.choices[0].message.content.trim()

    return NextResponse.json({ botMessage })
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error)

    return NextResponse.json(
      { error: 'Failed to generate bot response' },
      { status: 500 },
    )
  }
}
