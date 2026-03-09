import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useGameStore, CROP_TYPES } from '../../store/gameStore'

function PlantMesh({ plantType, stage, plantedAt }) {
  const meshRef = useRef()
  const config = CROP_TYPES[plantType]
  useFrame((state) => {
    if (!meshRef.current) return
    if (stage !== 'ready') meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + plantedAt) * 0.05
    if (stage === 'ready') meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 0.55
  })
  const scales = { seed: [0.15, 0.1, 0.15], sprout: [0.2, 0.4, 0.2], growing: [0.35, 0.7, 0.35], ready: [0.5, 1.0, 0.5] }
  const heights = { seed: 0.05, sprout: 0.2, growing: 0.4, ready: 0.55 }
  const scale = scales[stage] || scales.seed
  const height = heights[stage] || 0.1
  return (
    <group>
      {stage !== 'seed' && (
        <mesh position={[0, height * 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, height * 0.8, 6]} />
          <meshStandardMaterial color="#2d5a1e" />
        </mesh>
      )}
      <mesh ref={meshRef} position={[0, height, 0]} castShadow>
        {stage === 'seed' && <><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#8B6914" /></>}
        {stage === 'sprout' && <><coneGeometry args={[scale[0], scale[1], 6]} /><meshStandardMaterial color="#4CAF50" /></>}
        {stage === 'growing' && <><sphereGeometry args={[scale[0], 8, 8]} /><meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.05} /></>}
        {stage === 'ready' && <><dodecahedronGeometry args={[scale[0], 0]} /><meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.15} /></>}
      </mesh>
      {(stage === 'growing' || stage === 'ready') && (
        <>
          <mesh position={[-0.2, height * 0.6, 0]} rotation={[0, 0, -0.5]} castShadow><planeGeometry args={[0.25, 0.12]} /><meshStandardMaterial color="#3a8a2e" side={2} /></mesh>
          <mesh position={[0.2, height * 0.5, 0.1]} rotation={[0, 0.5, 0.4]} castShadow><planeGeometry args={[0.2, 0.1]} /><meshStandardMaterial color="#45a032" side={2} /></mesh>
        </>
      )}
      {stage === 'ready' && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

function GrowthProgress({ plantType, plantedAt }) {
  const config = CROP_TYPES[plantType]
  const [progress, setProgress] = useState(0)
  useFrame(() => {
    const elapsed = (Date.now() - plantedAt) / 1000
    setProgress(Math.min(elapsed / config.growthTime, 1))
  })
  if (progress >= 1) return null
  return (
    <Html position={[0, 1.5, 0]} center>
      <div style={{ width: 60, height: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: progress < 0.5 ? '#f39c12' : '#2ecc71', borderRadius: 3, transition: 'width 0.5s' }} />
      </div>
      <div style={{ fontSize: 10, color: '#fff', textAlign: 'center', marginTop: 2, fontFamily: 'Space Mono', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{Math.round(progress * 100)}%</div>
    </Html>
  )
}

const FarmPlot = ({ plot }) => {
  const [hovered, setHovered] = useState(false)
  const selectPlot = useGameStore(s => s.selectPlot)
  const harvestPlant = useGameStore(s => s.harvestPlant)
  const handleClick = (e) => {
    e.stopPropagation()
    if (plot.plant?.stage === 'ready') harvestPlant(plot.id)
    else if (!plot.plant) selectPlot(plot.id)
  }
  return (
    <group position={plot.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow onClick={handleClick}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshStandardMaterial color={hovered ? '#7a4f1a' : '#6b3e12'} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.25, 1.35, 4]} />
        <meshStandardMaterial color={hovered ? '#a07828' : '#8B6914'} />
      </mesh>
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={i} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.2, 0.25]} /><meshStandardMaterial color="#4a2e0a" roughness={1} />
        </mesh>
      ))}
      {plot.plant && (
        <>
          <PlantMesh plantType={plot.plant.type} stage={plot.plant.stage} plantedAt={plot.plant.plantedAt} />
          <GrowthProgress plantType={plot.plant.type} plantedAt={plot.plant.plantedAt} />
        </>
      )}
      {hovered && !plot.plant && (
        <Html position={[0, 1, 0]} center>
          <div style={{ background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'Fredoka', whiteSpace: 'nowrap', border: '1px solid rgba(46,204,113,0.4)' }}>Click para comprar semilla</div>
        </Html>
      )}
      {hovered && plot.plant?.stage === 'ready' && (
        <Html position={[0, 1.8, 0]} center>
          <div style={{ background: 'linear-gradient(135deg, #f1c40f, #e67e22)', color: '#1a1a1a', padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: 'Fredoka', whiteSpace: 'nowrap' }}>Reclamar Yield!</div>
        </Html>
      )}
    </group>
  )
}
export default FarmPlot
