import type { ReactNode } from 'react'
import { cn } from '../lib/cn.ts'

export function WindowBox({
  stamp,
  series,
  title,
  children,
  className,
}: {
  stamp: string
  series?: string
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('window-box', className)}>
      <div className="window-box-rail">
        <p className="stamp">{stamp}</p>
        {series ? <p className="stamp text-white/70">{series}</p> : null}
      </div>
      {title ? <p className="type-pack px-3 pb-2 text-white">{title}</p> : null}
      <div className="window-box-glass">{children}</div>
    </section>
  )
}
