import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',

      messages: [
        {
          role: 'system',
          content: `
Kamu adalah AI hook writer khusus konten dark storytelling Indonesia.

Tugas:
- buat 5 hook alternatif
- bikin penasaran
- cinematic
- disturbing
- viral
- scroll stopping
- pendek tapi kuat

Gunakan bahasa Indonesia yang natural dan modern.
`,
        },

        {
          role: 'user',
          content: `
Buatkan 5 hook alternatif berdasarkan script berikut:

${body.script}
`,
        },
      ],

      temperature: 1,
      max_tokens: 1000,
    })

    return Response.json({
      result: completion.choices[0].message.content,
    })
  } catch (error: any) {
    console.error(error)

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}