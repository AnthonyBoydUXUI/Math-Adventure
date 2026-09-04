import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/** Local studio IBL — collectible reflections without a CDN HDRI. */
export function StudioEnv({ intensity = 0.48 }: { intensity?: number }) {
  const { gl, scene } = useThree()
  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const tex = pmrem.fromScene(room, 0.04).texture
    scene.environment = tex
    scene.environmentIntensity = intensity
    return () => {
      scene.environment = null
      tex.dispose()
      pmrem.dispose()
      room.dispose()
    }
  }, [gl, scene, intensity])
  return null
}
