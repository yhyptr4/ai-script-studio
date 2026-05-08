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
Kamu adalah AI hook writer untuk konten dark storytelling Indonesia.

Tugasmu:
- membuat 5 hook alternatif
- lebih disturbing
- lebih viral
- lebih bikin penasaran
- lebih scroll stopping

Gunakan style:
- cinematic
- calm but disturbing
- dark documentary
- short form content

Hook harus:
- singkat
- tajam
- bikin orang berhenti scroll
`,
        },

        {
          role: 'user',
          content: `
Buat 5 hook alternatif berdasarkan script ini:

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