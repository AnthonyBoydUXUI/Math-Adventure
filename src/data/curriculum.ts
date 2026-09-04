import type { ModuleDef, SkillDef } from '../types.ts'

export const DIAGNOSTIC_PRIORS = {
  overall: 440,
  geometry: 480,
  numberSystem: 450,
  expressionsEquations: 430,
  ratios: 460,
  statisticsProbability: 380,
} as const

export const SKILLS: SkillDef[] = [
  { id: 'unit-rate', name: 'Unit rates', track: 'classroom', domain: 'ratios', moduleId: 'm1', topicId: 'm1-t1', blurb: 'How much for one.' },
  { id: 'constant-k', name: 'Constant of proportionality', track: 'classroom', domain: 'ratios', moduleId: 'm1', topicId: 'm1-t2', blurb: 'y = kx, in tables and graphs.' },
  { id: 'percent-of', name: 'Percent of a number', track: 'classroom', domain: 'ratios', moduleId: 'm2', topicId: 'm2-t1', blurb: 'Part = percent × whole.' },
  { id: 'percent-change', name: 'Percent change, tax, tip', track: 'classroom', domain: 'ratios', moduleId: 'm2', topicId: 'm2-t2', blurb: 'Markup, discount, and change.' },
  { id: 'integer-ops', name: 'Integer operations', track: 'classroom', domain: 'number', moduleId: 'm3', topicId: 'm3-t1', blurb: 'Add, subtract, multiply, divide integers.' },
  { id: 'rational-ops', name: 'Rational number operations', track: 'classroom', domain: 'number', moduleId: 'm4', topicId: 'm4-t1', blurb: 'Fractions and decimals in the same problem.' },
  { id: 'like-terms', name: 'Simplify expressions', track: 'classroom', domain: 'expressions', moduleId: 'm5', topicId: 'm5-t1', blurb: 'Like terms and the distributive property.' },
  { id: 'two-step-eq', name: 'Write and solve equations', track: 'classroom', domain: 'expressions', moduleId: 'm6', topicId: 'm6-t1', blurb: 'Two-step equations from words and symbols.' },
  { id: 'inequalities', name: 'Write and solve inequalities', track: 'classroom', domain: 'expressions', moduleId: 'm7', topicId: 'm7-t1', blurb: 'Solve, graph, and interpret.' },
  { id: 'angles-scale', name: 'Angles and scale drawings', track: 'classroom', domain: 'geometry', moduleId: 'm8', topicId: 'm8-t1', blurb: 'Angle relationships and scale.' },
  { id: 'circles-composite', name: 'Circles and composite area', track: 'classroom', domain: 'geometry', moduleId: 'm9', topicId: 'm9-t1', blurb: 'Circumference, area, composites.' },
  { id: 'surface-volume', name: 'Surface area and volume', track: 'classroom', domain: 'geometry', moduleId: 'm9', topicId: 'm9-t2', blurb: 'Prisms in the real world.' },
  { id: 'simple-prob', name: 'Simple probability', track: 'classroom', domain: 'stats', moduleId: 'm10', topicId: 'm10-t1', blurb: 'Favorable over total.' },
  { id: 'compound-prob', name: 'Compound probability', track: 'classroom', domain: 'stats', moduleId: 'm10', topicId: 'm10-t2', blurb: 'And, or, with and without replacement.' },
  { id: 'sampling-stats', name: 'Sampling and statistics', track: 'classroom', domain: 'stats', moduleId: 'm11', topicId: 'm11-t1', blurb: 'Samples, center, variability.' },
  { id: 'mult-facts', name: 'Multiplication flexibility', track: 'foundation', domain: 'foundation', blurb: 'Fast, accurate products — not baby drills.' },
  { id: 'factors', name: 'Factors and multiples', track: 'foundation', domain: 'foundation', blurb: 'GCF, LCM, and factor pairs.' },
  { id: 'multi-digit', name: 'Multi-digit arithmetic', track: 'foundation', domain: 'foundation', blurb: 'Keep place value honest.' },
  { id: 'fractions', name: 'Fraction sense', track: 'foundation', domain: 'foundation', blurb: 'Equivalence, compare, operate.' },
  { id: 'unit-convert', name: 'Unit conversions', track: 'foundation', domain: 'foundation', blurb: 'Customary and metric moves.' },
  { id: 'quadrilaterals', name: 'Quadrilaterals', track: 'foundation', domain: 'foundation', blurb: 'Properties you can actually use.' },
  { id: 'volume-found', name: 'Volume foundations', track: 'foundation', domain: 'foundation', blurb: 'V = lwh and packed cubes.' },
  { id: 'line-plots', name: 'Line plots', track: 'foundation', domain: 'foundation', blurb: 'Read, complete, and interpret.' },
  { id: 'multistep-word', name: 'Multi-step word problems', track: 'foundation', domain: 'foundation', blurb: 'What matters, what is noise.' },
  { id: 'slope-linear', name: 'Slope and y = mx + b', track: 'next', domain: 'algebra', blurb: 'Eighth-grade linear thinking.' },
  { id: 'pythag', name: 'Pythagorean theorem intro', track: 'next', domain: 'algebra', blurb: 'Right triangles, distance, courts.' },
  { id: 'systems-intro', name: 'Systems of equations intro', track: 'next', domain: 'algebra', blurb: 'Two stories, one pair (x, y).' },
  { id: 'exponents', name: 'Integer exponents', track: 'next', domain: 'algebra', blurb: 'Powers that grow and shrink.' },
  { id: 'function-notation', name: 'Function notation', track: 'next', domain: 'algebra', blurb: 'Algebra I: f(x) means an input-output machine.' },
  { id: 'exponential-intro', name: 'Exponential growth intro', track: 'next', domain: 'algebra', blurb: 'Algebra I: multiply, don’t add.' },
]

export const MODULES: ModuleDef[] = [
  {
    id: 'm1',
    volume: 1,
    number: 1,
    name: 'Proportional Relationships',
    topics: [
      { id: 'm1-t1', name: 'Unit rates', skillIds: ['unit-rate'] },
      { id: 'm1-t2', name: 'Constant of proportionality', skillIds: ['constant-k'] },
    ],
  },
  {
    id: 'm2',
    volume: 1,
    number: 2,
    name: 'Solve Percent Problems',
    topics: [
      { id: 'm2-t1', name: 'Percent of a number', skillIds: ['percent-of'] },
      { id: 'm2-t2', name: 'Percent change', skillIds: ['percent-change'] },
    ],
  },
  {
    id: 'm3',
    volume: 1,
    number: 3,
    name: 'Operations With Integers',
    topics: [{ id: 'm3-t1', name: 'Integer operations', skillIds: ['integer-ops'] }],
  },
  {
    id: 'm4',
    volume: 1,
    number: 4,
    name: 'Operations With Rational Numbers',
    topics: [{ id: 'm4-t1', name: 'Rational operations', skillIds: ['rational-ops'] }],
  },
  {
    id: 'm5',
    volume: 2,
    number: 5,
    name: 'Simplify Algebraic Expressions',
    topics: [{ id: 'm5-t1', name: 'Like terms and distribute', skillIds: ['like-terms'] }],
  },
  {
    id: 'm6',
    volume: 2,
    number: 6,
    name: 'Write and Solve Equations',
    topics: [{ id: 'm6-t1', name: 'Two-step equations', skillIds: ['two-step-eq'] }],
  },
  {
    id: 'm7',
    volume: 2,
    number: 7,
    name: 'Write and Solve Inequalities',
    topics: [{ id: 'm7-t1', name: 'Inequalities', skillIds: ['inequalities'] }],
  },
  {
    id: 'm8',
    volume: 2,
    number: 8,
    name: 'Geometric Figures',
    topics: [{ id: 'm8-t1', name: 'Angles and scale', skillIds: ['angles-scale'] }],
  },
  {
    id: 'm9',
    volume: 2,
    number: 9,
    name: 'Measure Figures',
    topics: [
      { id: 'm9-t1', name: 'Circles and composite area', skillIds: ['circles-composite'] },
      { id: 'm9-t2', name: 'Surface area and volume', skillIds: ['surface-volume'] },
    ],
  },
  {
    id: 'm10',
    volume: 2,
    number: 10,
    name: 'Probability',
    topics: [
      { id: 'm10-t1', name: 'Simple probability', skillIds: ['simple-prob'] },
      { id: 'm10-t2', name: 'Compound probability', skillIds: ['compound-prob'] },
    ],
  },
  {
    id: 'm11',
    volume: 2,
    number: 11,
    name: 'Sampling and Statistics',
    topics: [{ id: 'm11-t1', name: 'Sampling and stats', skillIds: ['sampling-stats'] }],
  },
]

export function skillById(id: string) {
  return SKILLS.find((s) => s.id === id)
}

export function moduleById(id: string) {
  return MODULES.find((m) => m.id === id)
}

export function skillsForTopic(moduleId: string, topicId: string) {
  const mod = moduleById(moduleId)
  const topic = mod?.topics.find((t) => t.id === topicId)
  return topic?.skillIds ?? []
}

export function firstTopicId(moduleId: string) {
  return moduleById(moduleId)?.topics[0]?.id
}

export const DOMAIN_TO_PRIOR: Record<string, number> = {
  ratios: DIAGNOSTIC_PRIORS.ratios,
  number: DIAGNOSTIC_PRIORS.numberSystem,
  expressions: DIAGNOSTIC_PRIORS.expressionsEquations,
  geometry: DIAGNOSTIC_PRIORS.geometry,
  stats: DIAGNOSTIC_PRIORS.statisticsProbability,
  foundation: DIAGNOSTIC_PRIORS.overall,
  algebra: DIAGNOSTIC_PRIORS.expressionsEquations + 20,
}
