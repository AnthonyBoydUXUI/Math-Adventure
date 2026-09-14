import { SKILLS } from '../data/curriculum.ts'
import { QUESTIONS } from '../data/questions.ts'
import type { ScoreboardKind, SkillDef } from '../types.ts'

export interface TinyStep {
  title: string
  say: string
  do: string
  example?: string
}

export interface HomeworkPlan {
  concept: string
  skillId: string
  skill?: SkillDef
  asking: string
  known: string[]
  move: string
  scoreboard: ScoreboardKind
  hints: string[]
  check?: number | string
  checkKind: 'number' | 'text' | 'none'
  why: string
  anotherWay: string
  relatedIds: string[]
  steps: TinyStep[]
}

const SKILL_HINTS: { test: RegExp; skillId: string }[] = [
  { test: /percent|tip|tax|discount|markup|%/i, skillId: 'percent-of' },
  { test: /unit rate|per hour|mph|per one/i, skillId: 'unit-rate' },
  { test: /proportional|constant of|y\s*=\s*kx/i, skillId: 'constant-k' },
  { test: /inequal|greater than|less than|at least|at most|[<>]=?/i, skillId: 'inequalities' },
  { test: /\b(solve|equations?|two-step)\b|[a-z]\s*=\s*/i, skillId: 'two-step-eq' },
  { test: /like terms|distribut|simplif/i, skillId: 'like-terms' },
  { test: /probab|spinner|p\(/i, skillId: 'simple-prob' },
  { test: /mean|median|sample|line plot|mad\b/i, skillId: 'sampling-stats' },
  { test: /circle|circumfer|π|pi\b/i, skillId: 'circles-composite' },
  { test: /volume|surface area|prism/i, skillId: 'surface-volume' },
  { test: /angle|supplement|vertical|scale draw/i, skillId: 'angles-scale' },
  { test: /integer|negative|number line/i, skillId: 'integer-ops' },
  { test: /fraction|mixed number|rational/i, skillId: 'rational-ops' },
  { test: /slope|y\s*=\s*mx|linear/i, skillId: 'slope-linear' },
  { test: /pythag|hypotenuse|right triangle/i, skillId: 'pythag' },
  { test: /percent change|increase|decrease|markup/i, skillId: 'percent-change' },
  { test: /compound|replacement|and then/i, skillId: 'compound-prob' },
  { test: /exponent|power of|squared|cubed/i, skillId: 'exponents' },
  { test: /exponential|double each|grows by a factor/i, skillId: 'exponential-intro' },
  { test: /f\s*\(|function of/i, skillId: 'function-notation' },
  { test: /system of|two equations/i, skillId: 'systems-intro' },
]

export function identifyConcept(text: string) {
  return identifyWeekSkills(text)[0] ?? 'multistep-word'
}

export function identifyWeekSkills(text: string) {
  const hits: string[] = []
  for (const row of SKILL_HINTS) {
    if (row.test.test(text) && !hits.includes(row.skillId)) hits.push(row.skillId)
  }
  return hits.slice(0, 5)
}

export function simplestWalkthrough(skillId: string): TinyStep[] {
  const pack: Record<string, TinyStep[]> = {
    'percent-of': [
      { title: 'What is it asking?', say: 'Percent just means out of 100.', do: 'Circle the percent, and circle the whole.' },
      { title: 'Tiny version', say: 'Start with a number you can see.', do: '10% of 50 is 5. That’s one tenth.', example: '10% of 50 = 5' },
      { title: 'The move', say: 'Change the percent to a decimal, then multiply.', do: '15% is 0.15. Then 0.15 times the whole.' },
      { title: 'Your page', say: 'Same move. Your numbers.', do: 'Write percent × whole on paper before you punch it in.' },
      { title: 'Check', say: 'Does the size make sense?', do: '15% of 40 should be a little more than 4, not 40.' },
    ],
    'percent-change': [
      { title: 'What changed?', say: 'We only care about the start and the finish.', do: 'Write original amount, then new amount.' },
      { title: 'Tiny version', say: 'From 10 to 12 is up 2.', do: '2 out of 10 is 20%.', example: '(12 − 10) ÷ 10 = 0.20' },
      { title: 'The move', say: 'Difference over original. Then make it a percent.', do: 'Write (new − old) ÷ old.' },
      { title: 'Your page', say: 'Same fraction. Your numbers.', do: 'Keep the original on the bottom. Always.' },
      { title: 'Check', say: 'Did it go up or down?', do: 'If it got smaller, the percent change is a drop.' },
    ],
    'unit-rate': [
      { title: 'What is one?', say: 'Unit rate is the price or speed for a single unit.', do: 'Name the two amounts: 8 miles in 2 hours, or 3 packs for $12.' },
      { title: 'Tiny version', say: '2 cookies cost $4. One cookie is $2.', do: 'Divide the total by how many.', example: '4 ÷ 2 = 2 per one' },
      { title: 'The move', say: 'Divide so the bottom becomes 1.', do: 'Write “per one” next to the answer.' },
      { title: 'Your page', say: 'Same divide. Your numbers.', do: 'Keep the units: miles per hour, dollars per item.' },
      { title: 'Check', say: 'Would 2 of them add back to the original?', do: 'Multiply your per-one by the count. It should match.' },
    ],
    'constant-k': [
      { title: 'What stays the same?', say: 'k is the multiplier that never changes.', do: 'Find y and x in the table or story.' },
      { title: 'Tiny version', say: 'If x is 2 and y is 6, k is 3.', do: 'k = y ÷ x.', example: '6 ÷ 2 = 3' },
      { title: 'The move', say: 'Every pair should give the same k.', do: 'Check a second pair the same way.' },
      { title: 'Your page', say: 'Write y = kx with your k.', do: 'Then plug x in to find y, or y to find x.' },
      { title: 'Check', say: 'Does (0, 0) fit?', do: 'A true proportional graph goes through the origin.' },
    ],
    'two-step-eq': [
      { title: 'What are we finding?', say: 'The letter is the mystery pile.', do: 'Write the equation exactly. Do not solve yet.' },
      { title: 'Tiny version', say: '2x + 1 = 5. First undo the +1.', do: '5 − 1 = 4. Then 4 ÷ 2 = 2.', example: '2x + 1 = 5 → x = 2' },
      { title: 'The move', say: 'Undo the last thing first. Keep both sides honest.', do: 'Whatever you do to the left, do to the right.' },
      { title: 'Your page', say: 'Same two undos. Your numbers.', do: 'Write each undo on its own line.' },
      { title: 'Check', say: 'Plug the letter back in.', do: 'If both sides match, you are done.' },
    ],
    inequalities: [
      { title: 'What is the fence?', say: 'An inequality is a balance that can lean.', do: 'Circle <, >, ≤, or ≥. That is the fence.' },
      { title: 'Tiny version', say: 'x + 2 > 5 means x > 3.', do: 'Undo just like an equation. Keep the sign unless you multiply or divide by a negative.', example: 'x + 2 > 5 → x > 3' },
      { title: 'The move', say: 'Solve, then think about which side is allowed.', do: 'Open circle vs closed circle. Shade the true side.' },
      { title: 'Your page', say: 'Same undos. Your fence.', do: 'Write one number that works, and one that does not.' },
      { title: 'Check', say: 'Pick a test number from the shaded side.', do: 'Plug it in. It should make the sentence true.' },
    ],
    'like-terms': [
      { title: 'What can pack together?', say: 'Like terms have the same letter and same power.', do: 'Underline the x terms. Circle the plain numbers.' },
      { title: 'Tiny version', say: '3x + 2x is 5x. 3x + 2 is not 5x.', do: 'Only add the matching piles.', example: '3x + 2x + 4 = 5x + 4' },
      { title: 'The move', say: 'Distribute first if there are parentheses.', do: 'Then pack likes. Leave unlike piles alone.' },
      { title: 'Your page', say: 'Same packing. Your expression.', do: 'Rewrite one clean line before you stop.' },
      { title: 'Check', say: 'Did you add x to a number?', do: 'If yes, undo that. Numbers and x stay in separate piles.' },
    ],
    'integer-ops': [
      { title: 'Which way on the line?', say: 'Negative is left. Positive is right.', do: 'Draw a tiny number line. Mark zero.' },
      { title: 'Tiny version', say: '3 + (−5) is walk right 3, then left 5. Land on −2.', do: 'Adding a negative is subtracting.', example: '3 + (−5) = −2' },
      { title: 'The move', say: 'Same signs multiply positive. Different signs multiply negative.', do: 'Write the sign before you multiply.' },
      { title: 'Your page', say: 'Same walk. Your numbers.', do: 'Talk the signs out loud: same or different?' },
      { title: 'Check', say: 'Is the answer on the side you expected?', do: 'If two negatives multiply, the product is positive.' },
    ],
    'rational-ops': [
      { title: 'Same size pieces?', say: 'Fractions only add when the bottoms match.', do: 'Write each fraction. Circle the denominators.' },
      { title: 'Tiny version', say: '1/2 + 1/4 needs fourths. 2/4 + 1/4 = 3/4.', do: 'Make the bottoms match, then add the tops.', example: '1/2 + 1/4 = 3/4' },
      { title: 'The move', say: 'If it is multiply, tops times tops, bottoms times bottoms.', do: 'Then simplify. Divide top and bottom by the same number.' },
      { title: 'Your page', say: 'Same pieces. Your fractions.', do: 'Keep work in a column so the bottoms stay lined up.' },
      { title: 'Check', say: 'Is the fraction bigger than 1 or less than 1?', do: 'Estimate with 1/2 and 1 before you lock it.' },
    ],
    'simple-prob': [
      { title: 'What counts as a win?', say: 'Probability is wins over all the same-size chances.', do: 'Name the favorable outcomes. Then name the total.' },
      { title: 'Tiny version', say: '1 gold out of 4 tiles is 1/4.', do: 'Write favorable over total.', example: 'P(gold) = 1/4' },
      { title: 'The move', say: 'Same size pieces. Don’t mix big and small unless you say so.', do: 'Simplify the fraction if you can.' },
      { title: 'Your page', say: 'Same fraction. Your spinner or bag.', do: 'Count carefully. Write the total last so you don’t skip one.' },
      { title: 'Check', say: 'Is it between 0 and 1?', do: '0 means never. 1 means always. 1/2 means half the time.' },
    ],
    'compound-prob': [
      { title: 'One spin or two?', say: 'And means both. Watch whether you put it back.', do: 'Write spin 1, then spin 2.' },
      { title: 'Tiny version', say: 'Two coins: P(heads and heads) is 1/2 × 1/2 = 1/4.', do: 'Multiply when both have to happen.', example: '1/2 × 1/2 = 1/4' },
      { title: 'The move', say: 'Without replacement, the second total gets smaller.', do: 'Change the second fraction if you kept the first tile out.' },
      { title: 'Your page', say: 'Same two fractions. Your story.', do: 'Label “put back” or “kept out” before you multiply.' },
      { title: 'Check', say: 'Is the and-answer smaller than each single chance?', do: 'Both happening should be harder than one happening.' },
    ],
    'angles-scale': [
      { title: 'What is the picture saying?', say: 'Scale is a copy with a multiplier. Angles that match stay the same size.', do: 'Mark the angle you need. Write the scale factor if there is one.' },
      { title: 'Tiny version', say: 'A drawing at 1:2 is half as long.', do: 'Multiply lengths by the scale. Do not multiply angle degrees by the scale.', example: '10 cm × 2 = 20 cm in real life' },
      { title: 'The move', say: 'Vertical angles are equal. A straight line is 180°.', do: 'Write the fact you are using in words.' },
      { title: 'Your page', say: 'Same fact. Your figure.', do: 'Sketch and label before you compute.' },
      { title: 'Check', say: 'Do the angles around a point add to 360°?', do: 'If a length got bigger, the copy is an enlargement.' },
    ],
    'circles-composite': [
      { title: 'Circle parts', say: 'Radius is center to edge. Diameter is all the way across.', do: 'Write r or d. Don’t mix them up.' },
      { title: 'Tiny version', say: 'If r is 2, circumference is 2πr. Area is πr².', do: 'C = 2πr. A = πr².', example: 'r = 2 → A = 4π' },
      { title: 'The move', say: 'Composite means add or subtract shapes.', do: 'Area of whole minus the hole, or two shapes added.' },
      { title: 'Your page', say: 'Same formulas. Your numbers.', do: 'Write which formula you are using before the numbers.' },
      { title: 'Check', say: 'Is area using r squared?', do: 'If you used 2πr for area, that’s circumference. Switch.' },
    ],
    'surface-volume': [
      { title: 'Space or wrapping?', say: 'Volume is how much it holds. Surface area is the wrapping paper.', do: 'Say which one the problem wants.' },
      { title: 'Tiny version', say: 'A 2 by 3 by 4 box holds 24 cubes.', do: 'V = l × w × h.', example: '2 × 3 × 4 = 24' },
      { title: 'The move', say: 'Surface area adds the faces.', do: 'Two of each: lw, lh, wh. Then add.' },
      { title: 'Your page', say: 'Same multiply. Your edges.', do: 'Write the three numbers in order so you don’t drop one.' },
      { title: 'Check', say: 'Volume should feel like cubes. Surface should feel like faces.', do: 'Units: cubic for volume, square for surface.' },
    ],
    'sampling-stats': [
      { title: 'What is the pile?', say: 'A sample is a smaller group used to learn about a bigger group.', do: 'Name the sample. Name the whole group it stands for.' },
      { title: 'Tiny version', say: 'Mean of 2, 4, 6 is 4. Median is the middle.', do: 'Add and divide for mean. Line up for median.', example: '2, 4, 6 → mean 4' },
      { title: 'The move', say: 'A fair sample is mixed, not just the easy kids.', do: 'Ask: who got left out?' },
      { title: 'Your page', say: 'Same center. Your data.', do: 'Write mean or median on purpose. Don’t mix them.' },
      { title: 'Check', say: 'Does one huge number pull the mean?', do: 'If yes, the median may tell a fairer story.' },
    ],
    'slope-linear': [
      { title: 'Rise over run', say: 'Slope is how much y changes when x goes up by 1.', do: 'Pick two points. Write rise, then run.' },
      { title: 'Tiny version', say: 'From (0, 1) to (2, 5), rise 4, run 2, slope 2.', do: 'm = rise ÷ run.', example: 'm = 4/2 = 2' },
      { title: 'The move', say: 'y = mx + b. b is where it hits the y-axis.', do: 'Write m and b before you graph.' },
      { title: 'Your page', say: 'Same rise over run. Your points.', do: 'Keep the order: second minus first, for both x and y.' },
      { title: 'Check', say: 'Does x = 0 give b?', do: 'Plug x = 0. You should get the intercept.' },
    ],
    pythag: [
      { title: 'Right triangle only', say: 'a² + b² = c². c is the long side, the hypotenuse.', do: 'Mark the right angle. The side across from it is c.' },
      { title: 'Tiny version', say: '3-4-5. 9 + 16 = 25.', do: 'Square, add, then square root if you need the side.', example: '3² + 4² = 5²' },
      { title: 'The move', say: 'If you know two sides, you can find the third.', do: 'Write which side is missing before you compute.' },
      { title: 'Your page', say: 'Same squares. Your triangle.', do: 'Don’t add the sides first. Square first.' },
      { title: 'Check', say: 'Is c the longest?', do: 'If your hypotenuse came out shorter than a leg, swap.' },
    ],
    'systems-intro': [
      { title: 'Two stories, one pair', say: 'A system wants an x and y that work in both equations.', do: 'Write both equations. Circle what you are solving for.' },
      { title: 'Tiny version', say: 'x + y = 5 and x = 2. Then y = 3.', do: 'Substitute the easy letter first.', example: 'x = 2, y = 3' },
      { title: 'The move', say: 'Substitution or graph: where they cross.', do: 'Find one letter, then the other.' },
      { title: 'Your page', say: 'Same swap. Your two lines.', do: 'Keep both equations visible so you don’t lose one.' },
      { title: 'Check', say: 'Plug the pair into BOTH.', do: 'If only one equation is happy, keep going.' },
    ],
    exponents: [
      { title: 'Repeated multiply', say: 'x³ means x times x times x. Not 3x.', do: 'Write the base and the little number (the exponent).' },
      { title: 'Tiny version', say: '2³ = 8. 2⁻¹ = 1/2.', do: 'Negative exponent means “one over.”', example: '2³ = 8' },
      { title: 'The move', say: 'Same base: add exponents when you multiply.', do: 'x² · x³ = x⁵.' },
      { title: 'Your page', say: 'Same base rules. Your powers.', do: 'Don’t multiply the bases if the exponent rule already did the work.' },
      { title: 'Check', say: 'Is it repeated multiply or just times the exponent?', do: '3² is 9, not 6.' },
    ],
    'function-notation': [
      { title: 'Machine', say: 'f(x) means “plug this in.” x is the input.', do: 'Circle the number inside the parentheses. That is the input.' },
      { title: 'Tiny version', say: 'If f(x) = 2x + 1, then f(3) = 7.', do: 'Replace every x with 3.', example: 'f(3) = 2·3 + 1 = 7' },
      { title: 'The move', say: 'Input in, output out. Don’t solve for x unless they ask.', do: 'Write f(that number) = …' },
      { title: 'Your page', say: 'Same plug-in. Your rule.', do: 'Replace every x, even if it shows up twice.' },
      { title: 'Check', say: 'Did you replace x, or multiply by f?', do: 'f is the name of the machine, not a number to multiply.' },
    ],
    'exponential-intro': [
      { title: 'Multiply, don’t add', say: 'Exponential growth multiplies over and over.', do: 'Write the start amount and the multiplier.' },
      { title: 'Tiny version', say: 'Start 3, double three times: 3, 6, 12, 24.', do: 'Each step × 2.', example: '3 × 2³ = 24' },
      { title: 'The move', say: 'Start × (multiplier)^(how many steps).', do: 'Count the jumps carefully.' },
      { title: 'Your page', say: 'Same multiply-repeat. Your story.', do: 'Write the first three terms so the pattern is visible.' },
      { title: 'Check', say: 'Is it growing faster than a line?', do: 'If you added the same number each time, that’s linear, not exponential.' },
    ],
    fractions: [
      { title: 'Same size pieces', say: 'A fraction is a part of a whole that was cut evenly.', do: 'Name the whole. Name how many pieces you have.' },
      { title: 'Tiny version', say: '2/4 is the same as 1/2.', do: 'Divide top and bottom by 2.', example: '2/4 = 1/2' },
      { title: 'The move', say: 'Simplify first when you can. It makes the rest easier.', do: 'Find a number that splits both top and bottom.' },
      { title: 'Your page', say: 'Same simplify. Your fraction.', do: 'Write the pretty version, then do the operation.' },
      { title: 'Check', say: 'Did both parts get divided by the same number?', do: 'If only the top changed, put it back.' },
    ],
    'multistep-word': [
      { title: 'What is it asking?', say: 'The last sentence is usually the real question.', do: 'Underline the question. Cross out extra story.' },
      { title: 'Tiny version', say: 'Use smaller numbers in the same story.', do: 'If the story is 3 bags of 4, try 2 bags of 3 first.' },
      { title: 'The move', say: 'One step at a time. Write the answer to step 1 before step 2.', do: 'Label each number: bags, each, total.' },
      { title: 'Your page', say: 'Same steps. Your story.', do: 'Leave a line between steps so you can see the path.' },
      { title: 'Check', say: 'Did you answer the question they asked?', do: 'Read the last sentence again. Units on the answer.' },
    ],
  }

  return (
    pack[skillId] ?? [
      { title: 'What is it asking?', say: 'Read the last sentence first.', do: 'Say the question in your own words.' },
      { title: 'Tiny version', say: 'Same idea, friendlier numbers.', do: 'Try a smaller copy of the problem on scratch paper.' },
      { title: 'The move', say: 'Pick one math move. Write it.', do: 'Don’t compute in your head yet.' },
      { title: 'Your page', say: 'Now your numbers.', do: 'Copy the same move. Show each line.' },
      { title: 'Check', say: 'Does the size make sense?', do: 'Estimate first. Then compare.' },
    ]
  )
}

function parsePercentOf(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return (Number(m[1]) / 100) * Number(m[2])
}

function parseWhatPercent(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s+is\s+what\s+percent\s+of\s+(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return (Number(m[1]) / Number(m[2])) * 100
}

function parseTwoStep(text: string) {
  const m = text.match(/(\d+)\s*([a-z])\s*([+-])\s*(\d+)\s*=\s*(\d+)/i)
  if (!m) return null
  const a = Number(m[1])
  const sign = m[3] === '+' ? 1 : -1
  const b = Number(m[4]) * sign
  const c = Number(m[5])
  return (c - b) / a
}

function parseSimpleAdd(text: string) {
  const m = text.match(/(-?\d+)\s*\+\s*(-?\d+)/)
  if (!m) return null
  return Number(m[1]) + Number(m[2])
}

function parseProduct(text: string) {
  const m = text.match(/(-?\d+)\s*[×x*]\s*(-?\d+)/)
  if (!m) return null
  return Number(m[1]) * Number(m[2])
}

function parseVolume(text: string) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(?:by|x|×)\s*(\d+(?:\.\d+)?)\s*(?:by|x|×)\s*(\d+(?:\.\d+)?)/i)
  if (!m) return null
  return Number(m[1]) * Number(m[2]) * Number(m[3])
}

export function buildHomeworkPlan(raw: string): HomeworkPlan {
  const text = raw.trim()
  const skillId = identifyConcept(text)
  const skill = SKILLS.find((s) => s.id === skillId)
  const relatedIds = QUESTIONS.filter((q) => q.skillId === skillId)
    .slice(0, 3)
    .map((q) => q.id)

  let check: number | string | undefined
  let checkKind: HomeworkPlan['checkKind'] = 'none'
  const percentOf = parsePercentOf(text)
  const whatPct = parseWhatPercent(text)
  const twoStep = parseTwoStep(text)
  const sum = parseSimpleAdd(text)
  const prod = parseProduct(text)
  const vol = parseVolume(text)

  if (percentOf !== null) {
    check = Math.round(percentOf * 1000) / 1000
    checkKind = 'number'
  } else if (whatPct !== null) {
    check = Math.round(whatPct * 1000) / 1000
    checkKind = 'number'
  } else if (twoStep !== null) {
    check = twoStep
    checkKind = 'number'
  } else if (vol !== null) {
    check = vol
    checkKind = 'number'
  } else if (prod !== null) {
    check = prod
    checkKind = 'number'
  } else if (sum !== null) {
    check = sum
    checkKind = 'number'
  }

  const scoreboard: ScoreboardKind =
    skillId === 'two-step-eq' || skillId === 'inequalities' ? 'equation' : 'word'

  return {
    concept: skill?.name ?? 'Multi-step thinking',
    skillId,
    skill,
    asking: 'What is this actually asking you to find?',
    known: [
      'Name the numbers that matter.',
      'Cross out extra story details.',
      'Label the units.',
    ],
    move:
      skillId === 'percent-of'
        ? 'Part = percent × whole — or percent = part ÷ whole.'
        : skillId === 'two-step-eq'
          ? 'Undo the last operation first. Keep both sides honest.'
          : skillId === 'simple-prob'
            ? 'Favorable over total. Same size pieces.'
            : 'Pick the math move, then write it before you compute.',
    scoreboard,
    hints: [
      'Don’t solve it in your head yet.',
      'Write what you know, what you need to find, and the move.',
      'Guess whether the answer should be bigger or smaller than a nearby number.',
    ],
    check,
    checkKind,
    why: 'This is a coach, not an answer key. You still do the work.',
    anotherWay: 'Try a simpler number in the same setup, then come back.',
    relatedIds,
    steps: simplestWalkthrough(skillId),
  }
}

export function homeworkFeedback(plan: HomeworkPlan, attempt: string) {
  if (plan.checkKind === 'none' || plan.check === undefined) {
    return {
      verdict: 'recorded' as const,
      line: 'Got it. Check it against your paper. Does it pass?',
    }
  }
  const n = Number(attempt.replace(/[,$%]/g, ''))
  if (plan.checkKind === 'number' && Number.isFinite(n)) {
    const ok = Math.abs(n - Number(plan.check)) <= 0.05
    return {
      verdict: ok ? ('correct' as const) : ('retry' as const),
      line: ok
        ? 'That checks out. Write one sentence on why it makes sense.'
        : 'Not yet — don’t peek. Look at the move again, then try once more.',
    }
  }
  return { verdict: 'recorded' as const, line: 'Got it. Walk the check on paper.' }
}
