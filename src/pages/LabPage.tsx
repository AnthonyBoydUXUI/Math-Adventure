import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { SKILLS } from '../data/curriculum.ts'
import { familiesForSkill, questionById, questionsForFamily } from '../data/questions.ts'
import { generateDailyMission, labSequence } from '../engine/session.ts'
import { buildTestReport } from '../engine/testReady.ts'
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
      <p className="mt-1 font-medium text-ink">
        Same math, different look — the move timed tests actually make. We save every lab play so the next test wrapper is the one you still miss.
      </p>
      <div className="mt-4">
        <TestReadinessCard />
      </div>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-navy/45">Skill</label>
      <select
        className="mt-1 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
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
          <span key={q.id} className="rounded-sm border border-white/10 bg-paper px-2 py-0.5 text-[11px] font-semibold uppercase">
            {q.format}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {sample.slice(0, 4).map((q) => (
          <li key={q.id} className="rounded-sm border border-white/10 bg-paper px-3 py-2 text-sm font-medium">
            <span className="mr-2 font-semibold uppercase text-violet">{q.format}</span>
            {q.prompt}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="press mt-6 w-full rounded-xl bg-sky py-4 font-semibold text-chrome"
        onClick={() => {
          const report = buildTestReport(usePlayerStore.getState().attempts)
          const rng = mulberry32(hashString(`lab:${skillId}:${report.weakestFormat ?? 'any'}`))
          const lab = labSequence(familyId, rng, report.weakestFormat)
          const base = generateDailyMission(stats, parent, new Date(), true, usePlayerStore.getState().attempts)
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
                  coachLine: report.weakestFormat
                    ? `Lead with ${report.weakestFormat}. That’s the look the test uses.`
                    : 'The question may look different. The math is not.',
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
        Drill the test wrapper
      </button>
    </div>
  )
}
