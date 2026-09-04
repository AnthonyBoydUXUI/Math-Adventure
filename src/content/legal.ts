export const SUPPORT_ISSUES_URL = 'https://github.com/AnthonyBoydUXUI/Math-Adventure/issues'
export const REPO_URL = 'https://github.com/AnthonyBoydUXUI/Math-Adventure'
export const APP_NAME = 'Math Adventure'
export const PUBLISHER = 'Math Adventure'
export const LAST_UPDATED = 'September 4, 2026'

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export const PRIVACY_INTRO =
  'Math Adventure is a math practice app for students 12 and older. Practice works without an account. An optional email login backs up one profile so phone, tablet, laptop, and the watch glance stay in sync. We do not run ads or analytics, and we do not sell data.'

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Who this app is for',
    paragraphs: [
      'Math Adventure is designed for seventh- and eighth-grade students (typically ages 12–14). It is not directed at children under 13 and is not submitted in Apple’s Kids Category.',
      'We do not ask for a birthdate. A parent or a student 12 or older must acknowledge the first-launch notice before practice begins.',
    ],
  },
  {
    heading: 'What we collect — and where it lives',
    paragraphs: [
      'Without an account, progress is stored only in this device’s browser or app storage (localStorage key aero-math-adventure).',
      'If you create an account, we store your email (via Supabase Auth) and one profile row: XP, streak, mastery, attempt history, bookmark, and settings. That row is how phone and laptop share a save, and how a site-data clear can be recovered.',
      'Homework or paper photos stay on the device that took them. They are stripped from the cloud profile.',
      'Optional voice tutoring uses the operating system’s speech APIs on this device. Math Adventure does not record, upload, or keep audio.',
    ],
  },
  {
    heading: 'What we do not collect',
    paragraphs: [
      'No phone number, precise location, contacts, or payment information. Email is collected only if you choose to sign in.',
      'No advertising identifiers, no tracking pixels, no third-party analytics, and no sale or share of personal data for cross-app tracking.',
      'The only login is email and password. There is no third-party social login, so Sign in with Apple is not required.',
    ],
  },
  {
    heading: 'Permissions',
    paragraphs: [
      'Camera or photo library: used only when you choose to photograph homework or written work so the on-device coach can name the concept. Photos stay on this device.',
      'Microphone and speech recognition: used only when you tap Talk so the on-device voice tutor can hear a short phrase. Speech is not stored by Math Adventure.',
      'Haptics: a brief vibration on supported devices when you lock in an answer. You can ignore this; it is not required.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'Export a copy of the on-device save from Privacy Center.',
      'Delete the on-device save from Privacy Center. If you are signed in, the cloud profile remains until you delete it on the Account screen.',
      'Sign in after clearing site data to restore the cloud profile onto that device.',
    ],
  },
  {
    heading: 'Children’s privacy',
    paragraphs: [
      'Math Adventure is not intended for children under 13. If you believe a child under 13 has used the app, delete the local data, delete the cloud profile if one exists, and stop use.',
      'A parent can delete the cloud profile from Account. That removes the synced row. Contact support if you also need the Auth user removed.',
    ],
  },
  {
    heading: 'Third parties',
    paragraphs: [
      'The shipped app does not load analytics or advertising SDKs. Practice content is bundled with the app.',
      'Optional sync uses Supabase (Auth + one profiles table). Supabase’s privacy policy applies to that service.',
      'If you open Support and file a GitHub issue, GitHub’s own privacy policy applies to that website.',
    ],
  },
  {
    heading: 'Not a medical or official school diagnosis',
    paragraphs: [
      "Math Adventure's Lab snapshot, coaching lines, and readiness scores are practice feedback from your recent plays. They are not a medical diagnosis, psychological evaluation, IEP assessment, or official school or state test result.",
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      `Questions about privacy: open an issue on the public repository at ${SUPPORT_ISSUES_URL}. Do not include photos of other people’s work or student records that are not yours.`,
    ],
  },
]

export const TERMS_INTRO =
  'These Terms of Use govern your use of Math Adventure. By tapping Continue on the first-launch notice, you agree to these terms.'

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'License',
    paragraphs: [
      'We grant you a personal, non-exclusive, non-transferable license to use Math Adventure for educational practice on devices you own or control.',
      'You may not copy the practice items into a competing product, scrape the item bank, or imply that Math Adventure is an official school or publisher product.',
    ],
  },
  {
    heading: 'Age',
    paragraphs: [
      'You must be 12 or older, or a parent or guardian approving use for a student 12 or older. Math Adventure is not for children under 13.',
    ],
  },
  {
    heading: 'What Math Adventure is — and is not',
    paragraphs: [
      'Math Adventure is original practice software. Items are written to typical Grade 7 and Grade 8 course topics (ratios, percent, integers, equations, geometry, probability). They are not copied from any publisher’s textbook, homework, or item bank.',
      'Math Adventure is not affiliated with, endorsed by, or sponsored by any textbook publisher or school district. Names of commercial courses are not used as a claim of partnership.',
      'Math Adventure is not a medical device, therapy, or official diagnostic test. Scores are for practice only.',
    ],
  },
  {
    heading: 'Your content',
    paragraphs: [
      'Photos and notes you add stay on this device. Only photograph work you have a right to use. Do not photograph other students’ identifiable records to share them.',
      'Nothing you add is posted publicly by Math Adventure. There is no social feed.',
    ],
  },
  {
    heading: 'Acceptable use',
    paragraphs: [
      'Do not attempt to break, reverse engineer, or overload the app. Do not use Math Adventure to cheat on a live test or to generate an answer key for a restricted exam.',
    ],
  },
  {
    heading: 'Disclaimer',
    paragraphs: [
      'Math Adventure is provided “as is.” Practice feedback can be wrong. You are responsible for school work and test performance. We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement to the fullest extent allowed by law.',
    ],
  },
  {
    heading: 'Limitation of liability',
    paragraphs: [
      'To the fullest extent allowed by law, the publisher is not liable for indirect, incidental, special, or consequential damages, or for lost grades, lost data, or device issues arising from use of the app.',
    ],
  },
  {
    heading: 'Changes and contact',
    paragraphs: [
      `We may update these terms in a later version of the app. The date at the top is the current version.`,
      `Questions: ${SUPPORT_ISSUES_URL}`,
    ],
  },
]

export const SUPPORT_INTRO =
  'Math Adventure is a 15-minute math practice app. This page is the support contact Apple requires — you can read it in a browser without opening the app.'

export const SUPPORT_SECTIONS: LegalSection[] = [
  {
    heading: 'How to get help',
    paragraphs: [
      `Report a bug or ask a question: ${SUPPORT_ISSUES_URL}`,
      `Source repository: ${REPO_URL}`,
      'Please do not attach photos that include another student’s name, school ID, or unpublished test items.',
    ],
  },
  {
    heading: 'Daily loop',
    paragraphs: [
      'Warm-Up (3) · Skill Builder (4) · Test Lab (4) · Boss (3) · Recap (1). Keep Playing is optional.',
      'Test Lab shows the same math in a different wrapper so class strength can show up on a timed test.',
    ],
  },
  {
    heading: 'Camera, photos, and voice',
    paragraphs: [
      'Photograph homework only after you read the in-app explanation. Images stay on this device.',
      'Voice tutor uses on-device speech. If the mic is denied, type instead. Speech still plays without a mic.',
    ],
  },
  {
    heading: 'Progress and data',
    paragraphs: [
      'Progress lives on this device first. Sign in under More → Account to back it up to one profile.',
      'Clearing browser data wipes the local flight log. Sign in again to restore the cloud copy.',
    ],
  },
  {
    heading: 'Common issues',
    paragraphs: [
      'No sound until you tap the speaker — browsers block audio until a gesture.',
      'Voice listen needs HTTPS (or a native build) and a granted microphone.',
      'If the app ever shows a blank screen, force-quit and reopen. Use Privacy Center export first if you can.',
    ],
  },
]

export const CAMERA_PREAMBLE =
  'Math Adventure uses the camera or photo library only when you choose to photograph homework or written work. The image stays on this device and is never uploaded. You can skip photos and type the problem instead.'

export const MIC_PREAMBLE =
  'Math Adventure uses the microphone only while you tap Talk so the on-device voice tutor can hear a short phrase. Math Adventure does not record or upload audio. You can type instead.'

export function flattenLegal(sections: LegalSection[]): string {
  return sections.map((s) => `${s.heading}\n${s.paragraphs.join('\n')}`).join('\n\n')
}
