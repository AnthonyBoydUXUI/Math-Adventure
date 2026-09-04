import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TestReadinessCard } from '../components/TestReadinessCard.tsx'
import { SKILLS } from '../data/curriculum.ts'
import { familiesForSkill, questionById } from '../data/questions.ts'
import { generateDailyMission, labSequence } from '../engine/session.ts'
import { buildTestReport } from '../engine/testReady.ts'
import { worldForModule } from '../data/worlds.ts'
import { hashString, mulberry32 } from '../lib/hash.ts'
import { resumeAudio, startAmbient } from '../lib/sfx.ts'
import { usePlayerStore } from '../store.ts'

export function LabPage() {
  const navigate = useNavigate()
  const { stats, parent } = usePlayerStore()
  const focus = usePlayerStore((s) => s.mission.focusSkillId)
  const [skillId, setSkillId] = useState(focus)
  const familyId = familiesForSkill(skillId)[0] ?? 'hoodie-equation'

  return (
    <div className="px-4 pb-8">
      <h1 className="type-pack text-5xl">Lab</h1>
      <div className="mt-4">
        <TestReadinessCard compact />
      </div>
      <select
        className="mt-4 w-full rounded-sm border border-white/10 bg-paper px-3 py-3 font-semibold"
        value={skillId}
        onChange={(e) => setSkillId(e.target.value)}
        aria-label="Skill"
      >
        {SKILLS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="press mt-6 w-full bg-[#0e1a3a] py-4 font-semibold uppercase tracking-[0.12em] text-bone"
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
                  label: 'Lab',
                  coachLine: report.weakestFormat
                    ? `Lead with ${report.weakestFormat}.`
                    : 'Same math. New look.',
                },
                {
                  phase: 'recap',
                  minutes: 1,
                  questionIds: [],
                  label: 'Done',
                  coachLine: '',
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
              labCorrectCount: 0,
              usedVoiceAnotherWay: false,
              completed: false,
              readinessAtStart: report.readiness,
            },
          })
          const st = usePlayerStore.getState()
          void resumeAudio()
          if (st.soundOn) startAmbient(worldForModule(st.parent.moduleId).id, 'lab')
          navigate('/train')
        }}
      >
        Start
      </button>
    </div>
  )
}
