import { useMemo, useState } from 'react'
import { MIC_PREAMBLE } from '../content/legal.ts'
import { createVoiceProvider, parseVoice } from '../engine/voice/index.ts'
import { talkAnother, talkHeard, talkHint, talkWhy } from '../engine/voice/talk.ts'
import { cn } from '../lib/cn.ts'
import { usePlayerStore } from '../store.ts'
import type { Question } from '../types.ts'
import { PermissionSheet } from './PermissionSheet.tsx'

const provider = createVoiceProvider('browser')

export function VoiceTutor({
  question,
  onAnswer,
}: {
  question?: Question
  onAnswer?: (value: string) => void
}) {
  const markVoice = usePlayerStore((s) => s.markVoice)
  const markPermissionExplained = usePlayerStore((s) => s.markPermissionExplained)
  const [open, setOpen] = useState(false)
  const [hearing, setHearing] = useState(false)
  const [askMic, setAskMic] = useState(false)
  const [line, setLine] = useState('You can say “I don’t get this,” or “I got 24.” I’ll follow you.')
  const support = useMemo(() => provider.supported(), [])

  function respond(transcript: string) {
    const parsed = parseVoice(transcript)
    if (!question) {
      setLine('Start today’s 15 and I’ll talk you through it.')
      return
    }
    if (parsed.intent === 'confused') {
      const hint = question.hints[0] ?? 'Grab paper. What is this actually asking you?'
      void provider.speak(talkHint(hint))
      setLine(hint)
    } else if (parsed.intent === 'another_way') {
      markVoice()
      void provider.speak(talkAnother(question.anotherWay))
      setLine(question.anotherWay)
    } else if (parsed.intent === 'why') {
      void provider.speak(talkWhy(question.why))
      setLine(question.why)
    } else if (parsed.intent === 'example') {
      void provider.speak('Same idea, smaller numbers. Start with the picture.')
      setLine('Same idea, smaller numbers. Start with the picture.')
    } else if (parsed.intent === 'hint') {
      const hint = question.hints[1] ?? question.hints[0] ?? 'Write what you know, and what you need to find.'
      void provider.speak(talkHint(hint))
      setLine(hint)
    } else if (parsed.intent === 'answer' && parsed.number !== undefined) {
      onAnswer?.(String(parsed.number))
      void provider.speak(talkHeard(parsed.number))
      setLine(`I heard ${parsed.number}. Lock it if that’s the one you want.`)
    } else {
      void provider.speak('I missed that. You can say I don’t get this, another way, or I got a number.')
      setLine('I missed that. Try “I don’t get this,” “another way,” or “I got 24.”')
    }
  }

  function listen() {
    if (!support.listen) {
      setLine('Voice in is off on this browser. Type instead.')
      return
    }
    if (!usePlayerStore.getState().permissions.micExplained) {
      setAskMic(true)
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
        <span>Talk it out</span>
        <span className="text-xs uppercase tracking-widest text-navy/40">{open ? 'hide' : 'talk'}</span>
      </button>
      {open ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-bold text-navy/70">{line}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                'press min-h-11 flex-1 rounded-xl py-2 text-sm font-semibold text-white',
                hearing ? 'bg-goggle' : 'bg-chrome',
              )}
              onClick={listen}
            >
              {hearing ? 'Listening…' : 'Talk'}
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
      {askMic ? (
        <PermissionSheet
          title="Microphone stays on this device"
          body={MIC_PREAMBLE}
          confirmLabel="Start listening"
          onConfirm={() => {
            markPermissionExplained('mic')
            setAskMic(false)
            requestAnimationFrame(listen)
          }}
          onCancel={() => setAskMic(false)}
        />
      ) : null}
    </div>
  )
}
