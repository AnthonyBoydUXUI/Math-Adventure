import { useEffect, useState } from 'react'
import { readSurface } from '../lib/device.ts'

export function useDeviceSurface() {
  const [surface, setSurface] = useState(readSurface)
  useEffect(() => {
    const onResize = () => setSurface(readSurface())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return surface
}
