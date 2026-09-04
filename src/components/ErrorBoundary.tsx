import { Component, type ErrorInfo, type ReactNode } from 'react'
import { SUPPORT_ISSUES_URL } from '../content/legal.ts'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto grid min-h-dvh max-w-xl place-items-center px-6 text-center">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">Aero</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Something broke on this screen</h1>
          <p className="mt-2 text-sm font-medium text-ink">
            Your progress is still on this device. Reload, or export data from Privacy Center if the screen stays blank.
          </p>
          <button
            type="button"
            className="press mt-6 min-h-11 w-full rounded-xl bg-sky font-semibold text-chrome"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <a
            className="mt-3 inline-flex min-h-11 items-center justify-center text-sm font-semibold text-sky"
            href={SUPPORT_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
          >
            Contact support
          </a>
        </div>
      </div>
    )
  }
}
