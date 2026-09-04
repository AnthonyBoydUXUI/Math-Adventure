import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Color, Mesh, MeshStandardMaterial, PMREMGenerator, PlaneGeometry, Scene } from 'three'

/** Local studio IBL — collectible reflections without a second Three.js copy. */
export function StudioEnv({ intensity = 0.48 }: { intensity?: number }) {
  const { gl, scene } = useThree()
  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const env = new Scene()
    env.background = new Color('#d4cfc6')
    const mat = new MeshStandardMaterial({ color: '#c4beb4', roughness: 0.62, metalness: 0.08 })
    const floor = new Mesh(new PlaneGeometry(24, 24), mat)
    floor.rotation.x = -Math.PI / 2
    env.add(floor)
    const wall = new Mesh(new PlaneGeometry(24, 16), mat)
    wall.position.set(0, 6, -10)
    env.add(wall)
    const tex = pmrem.fromScene(env, 0.04).texture
    scene.environment = tex
    scene.environmentIntensity = intensity
    return () => {
      scene.environment = null
      tex.dispose()
      pmrem.dispose()
      floor.geometry.dispose()
      wall.geometry.dispose()
      mat.dispose()
    }
  }, [gl, scene, intensity])
  return null
}
