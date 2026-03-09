import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'

export function FarmModel({ url, fallbackColor = '#8B4513', fallbackScale = [1,1,1], position = [0,0,0], rotation = [0,0,0], scale = 1 }) {
  return (
    <Suspense fallback={
      <mesh position={position} rotation={rotation} scale={fallbackScale} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={fallbackColor} />
      </mesh>
    }>
      <LoadedModel url={url} position={position} rotation={rotation} scale={scale} fallbackColor={fallbackColor} fallbackScale={fallbackScale} />
    </Suspense>
  )
}

function LoadedModel({ url, position, rotation, scale, fallbackColor, fallbackScale }) {
  let scene = null
  try {
    const gltf = useGLTF(url)
    scene = gltf.scene
  } catch (e) {
    return (
      <mesh position={position} rotation={rotation} scale={fallbackScale} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={fallbackColor} />
      </mesh>
    )
  }

  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      castShadow
      receiveShadow
    />
  )
}

export function preloadModels() {
  const models = [
    '/models/buildings/Barn.glb',
    '/models/buildings/Windmill.glb',
    '/models/animals/Cow.glb',
    '/models/animals/Chicken.glb',
    '/models/environment/Tree_1.glb',
  ]
  models.forEach(url => {
    try { useGLTF.preload(url) } catch(e) { /* Model not available yet */ }
  })
}

export default FarmModel
