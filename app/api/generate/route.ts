import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { idea, template } = body

    const isRevision =
      body.previousScript && body.revisionPrompt

    let userPrompt = ''

    if (isRevision) {
      userPrompt = `
INI SCRIPT SEBELUMNYA:

${body.previousScript}

REVISI YANG DIMINTA:
${body.revisionPrompt}

Tolong revisi script di atas sesuai instruksi terbaru.
`
    } else {
    userPrompt = `
Buat script storytelling dark cinematic berdasarkan topik berikut:

TOPIK:
${idea}

TEMPLATE STYLE:
${template}

Gunakan format:
[HOOK]
[FORESHADOW]
[BODY]
[CTA]

Durasi sekitar 5 menit.

Gunakan bahasa Indonesia yang immersive, enjoyable, cinematic, dan seperti narrator documentary modern YouTube.
`
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',

      messages: [
        {
          role: 'system',
          content: `
Kamu adalah AI scriptwriter profesional untuk content creator dark storytelling Indonesia.

ATURAN UTAMA:
- selalu ikuti format yang diminta user
- selalu ikuti durasi yang diminta user
- selalu ikuti style yang diminta user
- jangan menggunakan format tambahan yang tidak diminta

STYLE DASAR:
- dark cinematic storytelling
- calm but disturbing
- immersive
- realistic
- documentary feeling
- natural Indonesian
- bukan gaya presenter TV
- bukan gaya cerpen horror
- bukan screenplay film

OUTPUT:
- WAJIB beri penanda section sesuai format user
- contoh:
[HOOK]
[FORESHADOW]
[BODY]
[CTA]
- setiap section harus dipisah jelas dengan enter
- bikin penasaran
- cinematic
- engaging

PENTING:
- hanya gunakan kisah nyata
- jangan membuat cerita fiksi
- jangan membuat dialog karakter
- prioritaskan realism
- prioritaskan storytelling

`,
        },

        {
          role: 'user',
          content: userPrompt,
        },
      ],

      temperature: 0.9,
      max_tokens: 4000,
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