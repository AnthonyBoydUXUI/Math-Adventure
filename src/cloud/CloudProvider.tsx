import { createContext, useContext, type ReactNode } from 'react'
import { useCloudSync } from './useCloudSync.ts'

type CloudApi = ReturnType<typeof useCloudSync>

const CloudContext = createContext<CloudApi | null>(null)

export function CloudProvider({ children }: { children: ReactNode }) {
  const value = useCloudSync()
  return <CloudContext.Provider value={value}>{children}</CloudContext.Provider>
}

export function useCloud() {
  const ctx = useContext(CloudContext)
  if (!ctx) {
    throw new Error('useCloud must be used under CloudProvider')
  }
  return ctx
}
