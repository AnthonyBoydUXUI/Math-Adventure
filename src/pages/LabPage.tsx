import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILLS } from '../data/curriculum.ts'
import { familiesForSkill, questionById, questionsForFamily } from '../data/questions.ts'
import { generateDailyMission, labSequence } from '../engine/session.ts'
import { hashString, mulberry32 } from '../lib/hash.ts'
import { usePlayerStore } from '../store.ts'

export function LabPage() {
  const navigate = useNavigate()
  const { stats, parent } = usePlayerStore()
  const focus = usePlayerStore((s) => s.mission.focusSkillId)
  const [skillId, setSkillId] = useState(focus)
  const familyId = familiesForSkill(skillId)[0] ?? 'hoodie-equation'
  const sample = useMemo(() => questionsForFamily(familyId), [familyId])

  return (
    <div className="px-4 pb-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Test Lab</h1>
      <p className="mt-1 font-bold text-navy/65">
        Same math, different look. Word, equation, graph, table, diagram — one skill.
      </p>
      <label className="mt-4 block text-xs font-extrabold uppercase tracking-widest text-navy/45">Skill</label>
      <select
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white px-3 py-3 font-extrabold"
        value={skillId}
        onChange={(e) => setSkillId(e.target.value)}
      >
        {SKILLS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.track} · {s.name}
          </option>
        ))}
      </select>
      <div className="mt-3 flex flex-wrap gap-1">
        {sample.map((q) => (
          <span key={q.id} className="rounded-full border border-white/10 bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase">
            {q.format}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {sample.slice(0, 4).map((q) => (
          <li key={q.id} className="rounded-2xl border border-white/10 bg-white px-3 py-2 text-sm font-bold">
            <span className="mr-2 font-extrabold uppercase text-violet">{q.format}</span>
            {q.prompt}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="press mt-6 w-full rounded-xl bg-sky py-4 font-semibold text-chrome"
        onClick={() => {
          const rng = mulberry32(hashString(`lab:${skillId}`))
          const lab = labSequence(familyId, rng)
          const base = generateDailyMission(stats, parent)
          usePlayerStore.setState({
            mission: {
              ...base,
              title: 'Test Lab',
              familyId,
              focusSkillId: skillId,
              phases: [
                {
                  phase: 'lab',
                  minutes: 4,
                  questionIds: lab.map((q) => q.id),
                  label: 'Same math, different look',
                  coachLine: 'The question may look different. The math is not.',
                },
                {
                  phase: 'recap',
                  minutes: 1,
                  questionIds: [],
                  label: 'Recap',
                  coachLine: 'Name the format that tricked you.',
                },
              ],
            },
            session: {
              active: true,
              extra: true,
              phaseIndex: 0,
              itemIndex: 0,
              startedAt: Date.now(),
              questionStartedAt: Date.now(),
              draft: '',
              firstDraft: '',
              changed: false,
              hints: 0,
              paper: false,
              confidence: 3,
              awaitingLock: false,
              paperGate: Boolean(questionById(lab[0]?.id ?? '')?.paperFirst),
              labCorrectRun: 0,
              usedVoiceAnotherWay: false,
              completed: false,
            },
          })
          navigate('/train')
        }}
      >
        Run the formats
      </button>
    </div>
  )
}
