export interface AdventureWorld {
  id: string
  moduleId?: string
  track: 'classroom' | 'foundation' | 'next'
  name: string
  district: string
  blurb: string
  color: string
  accent: string
  icon: string
  skillIds: string[]
  prevId?: string
  nextId?: string
  bridgeLine: string
  adventure: string
  carry: string
  handoff: string
  /** Short lines for the 15-minute day in this district. */
  beats: {
    warmup: string
    builder: string
    lab: string
    boss: string
    recap: string
  }
}

export const WORLDS: AdventureWorld[] = [
  {
    id: 'harbor',
    moduleId: 'm1',
    track: 'classroom',
    name: 'Ratio Runway',
    district: 'Sky Harbor',
    blurb: 'Rates, k, and graphs that take off from the origin.',
    color: '#3d9bff',
    accent: '#ffc53d',
    icon: '🛩',
    skillIds: ['unit-rate', 'constant-k'],
    prevId: 'groundlab',
    nextId: 'market',
    bridgeLine: 'A unit rate is the ticket you carry into percent world.',
    adventure: 'Qualify on the runway. Pace is a rate.',
    carry: 'per-one thinking (unit rate / k)',
    handoff: 'Percent is the same k, wearing /100.',
    beats: {
      warmup: 'We’re taxiing. Find the per-one — the rate for a single unit.',
      builder: 'Hold onto k. Graphs take off from the origin.',
      lab: 'Same rate, just a new wrapper.',
      boss: 'Qualify the lap. Write the rate so we can see it.',
      recap: 'Ticket’s punched. Percent wears this same k.',
    },
  },
  {
    id: 'market',
    moduleId: 'm2',
    track: 'classroom',
    name: 'Tip Market',
    district: 'Neon Bazaar',
    blurb: 'Percents are ratios wearing a hundred-hat.',
    color: '#ff6a2b',
    accent: '#22a36b',
    icon: '🏷',
    skillIds: ['percent-of', 'percent-change'],
    prevId: 'harbor',
    nextId: 'belowzero',
    bridgeLine: 'Percent of a number is k times the whole — same move as y = kx.',
    adventure: 'Neon bazaar. Tips, tax, and lap shares.',
    carry: 'part = percent × whole',
    handoff: 'A discount is an integer drop. Drive downstairs.',
    beats: {
      warmup: 'Neon is on. Percent is still just a rate.',
      builder: 'Tip, tax, markdown — each one is a part of a whole.',
      lab: 'Same percent, different stall.',
      boss: 'Close the stall. Write the percent so it stays put.',
      recap: 'A discount is an integer drop next.',
    },
  },
  {
    id: 'belowzero',
    moduleId: 'm3',
    track: 'classroom',
    name: 'Below-Zero District',
    district: 'Signal Basement',
    blurb: 'Integers on a living number line.',
    color: '#7b61ff',
    accent: '#ff4d8d',
    icon: '❄',
    skillIds: ['integer-ops'],
    prevId: 'market',
    nextId: 'gallery',
    bridgeLine: 'A discount is an integer move. You’ll need that downstairs.',
    adventure: 'Ice number-line. Position can go below zero.',
    carry: 'integer direction on a line',
    handoff: 'Fractions are the same line with finer ticks.',
    beats: {
      warmup: 'Basement line. Which way you move matters.',
      builder: 'Add or subtract, but stay on the ice.',
      lab: 'Same integers, new look.',
      boss: 'Walk the line below zero. Take your time.',
      recap: 'Finer ticks are waiting in Paint Row.',
    },
  },
  {
    id: 'gallery',
    moduleId: 'm4',
    track: 'classroom',
    name: 'Fraction Gallery',
    district: 'Paint Row',
    blurb: 'Rationals as bars, canvases, and mixed moves.',
    color: '#ff4d8d',
    accent: '#3d9bff',
    icon: '🎨',
    skillIds: ['rational-ops'],
    prevId: 'belowzero',
    nextId: 'gearworks',
    bridgeLine: 'Negative + fraction is still one number line — just finer ticks.',
    adventure: 'Paint row. Mix parts of a whole.',
    carry: 'common denominators / rational ops',
    handoff: 'Like terms are the same “units” idea in symbols.',
    beats: {
      warmup: 'Mix the canvases. They’re the same whole.',
      builder: 'Get common parts first, then operate.',
      lab: 'Bars or mixed numbers — same paint.',
      boss: 'Finish the canvas on paper.',
      recap: 'Like units mesh over in Gearworks.',
    },
  },
  {
    id: 'gearworks',
    moduleId: 'm5',
    track: 'classroom',
    name: 'Gearworks',
    district: 'Like-Term Factory',
    blurb: 'Expressions click when like parts mesh.',
    color: '#0f766e',
    accent: '#ffc53d',
    icon: '⚙',
    skillIds: ['like-terms'],
    prevId: 'gallery',
    nextId: 'bridge',
    bridgeLine: 'Combining like terms is packing the same units — fraction sense helps.',
    adventure: 'Factory gears. Expressions that click.',
    carry: 'simplify before you solve',
    handoff: 'The Balance Bridge only works if both sides are simplified.',
    beats: {
      warmup: 'Gears only mesh when the units match.',
      builder: 'Combine the like terms. Leave the rest alone.',
      lab: 'Same expression, new casing.',
      boss: 'Simplify before you cross.',
      recap: 'The bridge needs both sides clean.',
    },
  },
  {
    id: 'bridge',
    moduleId: 'm6',
    track: 'classroom',
    name: 'Balance Bridge',
    district: 'Equation Span',
    blurb: 'Whatever you do to the left, the right has to feel.',
    color: '#e11d48',
    accent: '#ffc53d',
    icon: '⚖',
    skillIds: ['two-step-eq'],
    prevId: 'gearworks',
    nextId: 'boundary',
    bridgeLine: 'You simplify first. Then you undo. Gearworks feeds the bridge.',
    adventure: 'Equation span. Keep both sides honest.',
    carry: 'undo operations / balance',
    handoff: 'Inequalities use the same undos — with a shoreline, not a point.',
    beats: {
      warmup: 'Both sides feel every move — left and right stay even.',
      builder: 'Undo. Keep the span honest — just reverse the last step.',
      lab: 'Same equation, just a new wrapper.',
      boss: 'Write it out, then Balance the span.',
      recap: 'Shoreline next — same undos, open circle.',
    },
  },
  {
    id: 'boundary',
    moduleId: 'm7',
    track: 'classroom',
    name: 'Boundary Beach',
    district: 'More-Than Shore',
    blurb: 'Inequalities are equations with a shoreline.',
    color: '#22a36b',
    accent: '#3d9bff',
    icon: '🌊',
    skillIds: ['inequalities'],
    prevId: 'bridge',
    nextId: 'plaza',
    bridgeLine: 'Same undo moves as equations. Open circle instead of a point.',
    adventure: 'Coastal inequalities. More-than, less-than.',
    carry: 'inequality direction',
    handoff: 'Scale factor is a ratio from Harbor. Geometry needs it.',
    beats: {
      warmup: 'The shore is a cut, not a single point.',
      builder: 'Flip the sign only when you flip sides.',
      lab: 'Same inequality, new look.',
      boss: 'Mark the beach, then shade the side that works.',
      recap: 'Scale from Harbor is waiting at the plaza.',
    },
  },
  {
    id: 'plaza',
    moduleId: 'm8',
    track: 'classroom',
    name: 'Angle Plaza',
    district: 'Figure Walk',
    blurb: 'Scale drawings and angle pairs in the open air.',
    color: '#c2410c',
    accent: '#ffc53d',
    icon: '📐',
    skillIds: ['angles-scale'],
    prevId: 'boundary',
    nextId: 'courtcrate',
    bridgeLine: 'A scale factor is a ratio. Harbor never really left.',
    adventure: 'Angle plaza. Scale drawings and pairs.',
    carry: 'scale factor / angle pairs',
    handoff: 'Area scales by the factor squared. Court needs that.',
    beats: {
      warmup: 'Harbor’s k is a scale factor here.',
      builder: 'Pairs and drawings — keep the ratio.',
      lab: 'Same figure, new frame.',
      boss: 'Scale the plaza on paper.',
      recap: 'Area squares that factor once you’re on the court.',
    },
  },
  {
    id: 'courtcrate',
    moduleId: 'm9',
    track: 'classroom',
    name: 'Court & Crate',
    district: 'Measure Yards',
    blurb: 'Circles on the court, volume in the crate.',
    color: '#ff6a2b',
    accent: '#141628',
    icon: '🏀',
    skillIds: ['circles-composite', 'surface-volume'],
    prevId: 'plaza',
    nextId: 'arcade',
    bridgeLine: 'Area is a scaled drawing of space. Plaza’s scale factor squared.',
    adventure: 'Measure yards. Circles, crates, volume.',
    carry: 'area and volume formulas',
    handoff: 'Probability is a fraction of a whole — Gallery again, in a game skin.',
    beats: {
      warmup: 'Circle on the court, crate in the bay.',
      builder: 'Area first, then volume. Don’t mix them.',
      lab: 'Same measure, new skin.',
      boss: 'One crate. Write the space it takes.',
      recap: 'Chance alley uses part over whole.',
    },
  },
  {
    id: 'arcade',
    moduleId: 'm10',
    track: 'classroom',
    name: 'Spinner Arcade',
    district: 'Chance Alley',
    blurb: 'Probability is a fraction with a story.',
    color: '#7b61ff',
    accent: '#ff4d8d',
    icon: '🎰',
    skillIds: ['simple-prob', 'compound-prob'],
    prevId: 'courtcrate',
    nextId: 'station',
    bridgeLine: 'P(gold) is part/whole — Gallery fractions wearing game skins.',
    adventure: 'Chance alley. Spinners and compound “and”.',
    carry: 'favorable over total',
    handoff: 'A sample is a spinner of people. Station reads the plot.',
    beats: {
      warmup: 'Favorable over total. That’s the whole spin.',
      builder: 'And means both. Watch that second spin.',
      lab: 'Same chance, new cabinet.',
      boss: 'Call the spin, then write the fraction.',
      recap: 'People are a spinner once you’re at the dock.',
    },
  },
  {
    id: 'station',
    moduleId: 'm11',
    track: 'classroom',
    name: 'Sample Station',
    district: 'Data Dock',
    blurb: 'Samples, plots, and whether a survey actually represents.',
    color: '#1e3a5f',
    accent: '#3d9bff',
    icon: '📊',
    skillIds: ['sampling-stats'],
    prevId: 'arcade',
    nextId: 'peak',
    bridgeLine: 'A mean is a balance point. Arcade chance meets a line plot.',
    adventure: 'Data dock. Samples that actually represent.',
    carry: 'center, variability, honest samples',
    handoff: 'Linear rate from Harbor + balance from the Bridge = y = mx + b at Peak.',
    beats: {
      warmup: 'Does this sample actually speak for the dock?',
      builder: 'Center, spread, and an honest plot.',
      lab: 'Same data, new chart.',
      boss: 'Read the sample. Don’t let it lie.',
      recap: 'Harbor’s rate plus the bridge is Peak.',
    },
  },
  {
    id: 'groundlab',
    track: 'foundation',
    name: 'Ground Lab',
    district: 'Precision Bay',
    blurb: 'Not baby math — the habits that keep tests honest.',
    color: '#3d9bff',
    accent: '#fff6ec',
    icon: '🔬',
    skillIds: [
      'mult-facts',
      'factors',
      'multi-digit',
      'fractions',
      'unit-convert',
      'quadrilaterals',
      'volume-found',
      'line-plots',
      'multistep-word',
    ],
    nextId: 'harbor',
    bridgeLine: 'Foundation is the runway every district takes off from.',
    adventure: 'Precision bay. The RS does not roll without this.',
    carry: 'facts, fractions, multi-step paper',
    handoff: 'Every classroom district uses this as launch fuel.',
    beats: {
      warmup: 'Calibrate. Not baby math — just honest habits.',
      builder: 'Facts and fractions that keep tests clean.',
      lab: 'Same habit, new wrapper.',
      boss: 'Paper first. Then the RS can roll.',
      recap: 'Every district takes off from here.',
    },
  },
  {
    id: 'peak',
    track: 'next',
    name: 'Sky Peak',
    district: 'Algebra Approach',
    blurb: 'Slope, systems, f(x) — eighth grade and Algebra I air.',
    color: '#141628',
    accent: '#ffc53d',
    icon: '⛰',
    skillIds: ['slope-linear', 'pythag', 'systems-intro', 'exponents', 'function-notation', 'exponential-intro'],
    prevId: 'station',
    bridgeLine: 'Balance Bridge plus Ratio Runway becomes y = mx + b.',
    adventure: 'Algebra approach. Slope, systems, f(x).',
    carry: 'linear rate + balanced undos',
    handoff: 'This is eighth grade and Algebra I air — same car, higher gear.',
    beats: {
      warmup: 'Same RS. Just higher air.',
      builder: 'Slope, systems, f(x) — one at a time.',
      lab: 'Same linear idea, new look.',
      boss: 'Write the climb so we can see it.',
      recap: 'Eighth and Algebra I. Same car.',
    },
  },
]

export function worldForModule(moduleId: string) {
  return WORLDS.find((w) => w.moduleId === moduleId) ?? WORLDS[0]
}

export function worldById(id: string) {
  return WORLDS.find((w) => w.id === id)
}

export function classroomChain() {
  return WORLDS.filter((w) => w.track === 'classroom')
}

export function linkedWorld(world: AdventureWorld, dir: 'prev' | 'next') {
  const id = dir === 'prev' ? world.prevId : world.nextId
  return id ? worldById(id) : undefined
}

export function circuitPits() {
  return classroomChain().map((world, i) => ({
    world,
    x: i % 2 === 0 ? 82 : 248,
    y: 56 + i * 86,
  }))
}
