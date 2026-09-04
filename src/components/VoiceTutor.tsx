import { useMemo, useState } from 'react'
import { createVoiceProvider, parseVoice } from '../engine/voice/index.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import type { Question } from '../types.ts'

const provider = createVoiceProvider('browser')

export function VoiceTutor({
  question,
  onAnswer,
}: {
  question?: Question
  onAnswer?: (value: string) => void
}) {
  const markVoice = usePlayerStore((s) => s.markVoice)
  const [open, setOpen] = useState(false)
  const [hearing, setHearing] = useState(false)
  const [line, setLine] = useState('Say “I don’t get this” or “I got 24.”')
  const support = useMemo(() => provider.supported(), [])

  function respond(transcript: string) {
    const parsed = parseVoice(transcript)
    if (!question) {
      setLine('Start a flight and I’ll coach live.')
      return
    }
    if (parsed.intent === 'confused') {
      void provider.speak(question.hints[0] ?? 'Grab paper. What’s the question asking?')
      setLine(question.hints[0] ?? 'What’s the question asking?')
    } else if (parsed.intent === 'another_way') {
      markVoice()
      void provider.speak(question.anotherWay)
      setLine(question.anotherWay)
    } else if (parsed.intent === 'why') {
      void provider.speak(question.why)
      setLine(question.why)
    } else if (parsed.intent === 'example') {
      void provider.speak('Same structure, friendlier numbers. Try the visual first.')
      setLine('Same structure, smaller numbers. Use the picture.')
    } else if (parsed.intent === 'hint') {
      void provider.speak(question.hints[1] ?? question.hints[0] ?? 'Write KNOW and FIND.')
      setLine(question.hints[1] ?? question.hints[0] ?? '')
    } else if (parsed.intent === 'answer' && parsed.number !== undefined) {
      onAnswer?.(String(parsed.number))
      void provider.speak(`Locking in ${parsed.number}.`)
      setLine(`Heard ${parsed.number}. Lock it if that’s your answer.`)
    } else {
      void provider.speak('Try: I don’t get this, explain another way, or I got a number.')
      setLine('Try: “I don’t get this,” “another way,” or “I got 24.”')
    }
  }

  function listen() {
    if (!support.listen) {
      setLine('Voice in is off on this browser. Type instead.')
      return
    }
    setHearing(true)
    provider.listen((text, isFinal) => {
      if (!isFinal) setLine(text)
      else {
        setHearing(false)
        respond(text)
      }
    })
  }

  return (
    <div className="panel rounded-xl p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between font-semibold"
        onClick={() => setOpen((o) => !o)}
      >
        <span>Voice tutor</span>
        <span className="text-xs uppercase tracking-widest text-navy/40">{open ? 'hide' : 'talk'}</span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-bold text-navy/70">{line}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                'press flex-1 rounded-xl py-2 text-sm font-semibold text-white',
                hearing ? 'bg-goggle' : 'bg-chrome',
              )}
              onClick={listen}
            >
              {hearing ? 'Listening…' : 'Hold to talk'}
            </button>
            <button
              type="button"
              className="press rounded-xl border border-white/15 bg-mist px-3 text-sm font-semibold"
              onClick={() => {
                if (question) void provider.speak(question.prompt)
              }}
            >
              Hear it
            </button>
          </div>
          {!support.listen ? (
            <p className="text-xs font-bold text-navy/50">Mic needs Chrome/Safari HTTPS. Speech still plays.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
