'use client'

import { useState, useRef } from 'react'
import jsPDF from 'jspdf'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [revision, setRevision] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hooks, setHooks] = useState('')
  const [template, setTemplate] = useState('True Crime')
  const [loading, setLoading] = useState(false)
  const outputRef = useRef<HTMLDivElement | null>(null)

  async function generateScript() {
    try {
      setLoading(true)

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  idea,
  template,
}),
      })

      const data = await res.json()

      if (data.error) {
        setResult('ERROR: ' + data.error)
      } else {
        setResult(data.result)
        setHistory((prev) => [idea, ...prev])

setTimeout(() => {
  outputRef.current?.scrollIntoView({
    behavior: 'smooth',
  })
}, 200)
      }
    } catch (error) {
      setResult('Terjadi error saat generate script')
    } finally {
      setLoading(false)
    }
  }

  async function reviseScript() {
    try {
      setLoading(true)

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          previousScript: result,
          revisionPrompt: revision,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setResult('ERROR: ' + data.error)
      } else {
        setResult(data.result)
      }
    } catch (error) {
      setResult('Terjadi error saat revisi script')
    } finally {
      setLoading(false)
    }
  }

  async function generateHooks() {
  try {
    setLoading(true)

    const res = await fetch('/api/generate-hooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: result,
      }),
    })

    const data = await res.json()

    if (data.error) {
      setHooks('ERROR: ' + data.error)
    } else {
      setHooks(data.result)
    }
  } catch (error) {
    setHooks('Terjadi error saat generate hooks')
  } finally {
    setLoading(false)
  }
}
  function exportPDF() {
    if (!result) return

    const doc = new jsPDF()

    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const maxWidth = pageWidth - margin * 2

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)

    const lines = doc.splitTextToSize(result, maxWidth)

    doc.text(lines, margin, 20)

    const fileName = idea
      ? `${idea}.pdf`
      : 'ai-script.pdf'

    doc.save(fileName)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_40%)]" />

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-red-800 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        <div className="mb-14">

          <div className="inline-flex items-center gap-2 border border-red-900 bg-red-950/30 px-4 py-2 rounded-full text-red-300 text-sm mb-6 backdrop-blur-xl">
            ● AI Dark Storytelling Studio
          </div>

          <h1 className="text-7xl font-black tracking-tight leading-none max-w-4xl">
            Create
            <span className="text-red-500"> Cinematic </span>
            Scripts With AI
          </h1>

          <p className="text-zinc-400 text-xl mt-6 max-w-3xl leading-9">
            Generate disturbing real-case storytelling, dark documentary narration,
            and mindblowing cinematic scripts for TikTok & YouTube.
          </p>

        </div>

        <div className="flex flex-col gap-8">

          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Script Generator
            </h2>

<select
  value={template}
  onChange={(e) => setTemplate(e.target.value)}
  className="w-full mb-5 bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none text-lg"
>
  <option>True Crime</option>
  <option>Conspiracy</option>
  <option>Psychological Horror</option>
  <option>Historical Dark</option>
  <option>Mystery Investigation</option>
</select>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={`Contoh:

Chessboard Killer

Format:
Hook - Foreshadow - Body - CTA

Durasi:
5 menit

Style:
Dark cinematic realistic documentary`}
              className="w-full h-[220px] bg-black/40 border border-white/10 rounded-2xl p-6 text-white outline-none text-lg resize-none"
            />

            <div className="flex flex-wrap gap-4 mt-6">

              <button
                onClick={generateScript}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 transition px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-900/40"
              >
                <div className="flex items-center gap-3">
  {loading && (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )}

  <span>
    <div className="flex items-center gap-3">
  {loading && (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  )}

  <span>
    {loading
      ? 'AI is analyzing the darkness...'
      : 'Generate Script'}
  </span>
</div>
  </span>
</div>
              </button>

              

            </div>

            {result && (
              <>
                <h2 className="text-2xl font-bold mt-10 mb-4">
                  Revise Script
                </h2>

                <textarea
                  value={revision}
                  onChange={(e) => setRevision(e.target.value)}
                  placeholder="Contoh: buat hook lebih disturbing, pacing lebih lambat, ending lebih unsettling..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-6 text-white outline-none text-lg resize-none"
                />

                <button
                  onClick={reviseScript}
                  disabled={loading}
                  className="mt-5 bg-white text-black hover:opacity-80 transition px-8 py-4 rounded-2xl font-bold text-lg"
                >
                  {loading ? 'Revising...' : 'Revise Script'}
                </button>
              </>
            )}

          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl flex flex-col">

            <div className="flex items-center justify-between mb-6">
              {result && (
  <div className="flex gap-4 mb-6">

  <button
    onClick={() => {
      navigator.clipboard.writeText(result)
      alert('Script copied!')
    }}
    className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-2xl font-bold"
  >
    Copy Script
  </button>

  <button
    onClick={exportPDF}
    className="bg-green-600 hover:bg-green-500 transition px-6 py-3 rounded-2xl font-bold"
  >
    Export PDF
  </button>

  <button
    onClick={generateHooks}
    className="bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-2xl font-bold"
  >
    Generate Hooks
  </button>

</div>
)}

              <h2 className="text-2xl font-bold">
                AI Output
                {hooks && (
  <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8">

    <h2 className="text-3xl font-bold mb-6">
      Alternative Hooks
    </h2>

    <div className="whitespace-pre-wrap leading-8 text-zinc-300">
      {hooks}
    </div>

  </div>
)}
              </h2>

              <div className="text-sm text-zinc-500">
                Dark Cinematic Mode
              </div>

            </div>

            <div
  ref={outputRef}
  className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-8 overflow-y-auto whitespace-pre-wrap leading-9 text-lg text-zinc-200 min-h-[1000px]"
>
              {loading ? (
  <div className="flex flex-col items-center justify-center h-full text-center">

    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-8" />

    <h2 className="text-2xl font-bold text-red-400 mb-3">
      AI is analyzing the darkness...
    </h2>

    <p className="text-zinc-500 max-w-md leading-8">
      Building cinematic tension, uncovering disturbing details,
      and crafting a mindblowing narrative...
    </p>

  </div>
) : (
  result || 'Generated script akan muncul di sini...'
)}
            </div>

          </div>

        </div>

      </div>
<div className="fixed bottom-5 right-5 z-50">
  <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm text-zinc-400 shadow-xl">
    Created by <span className="text-red-500 font-semibold">Yahya Putra</span>
  </div>
</div>
{history.length > 0 && (
  <div className="max-w-6xl mx-auto px-6 pb-20">

    <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">

      <h2 className="text-3xl font-bold mb-6">
        Recent Scripts
      </h2>

      <div className="flex flex-wrap gap-4">

        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => setIdea(item)}
            className="bg-black/40 border border-white/10 hover:border-red-500 transition px-5 py-3 rounded-2xl text-zinc-300 hover:text-white"
          >
            {item}
          </button>
        ))}

      </div>

    </div>

  </div>
)}
    </main>
  )
}