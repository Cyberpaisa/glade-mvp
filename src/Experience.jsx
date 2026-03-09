import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import FarmPlot from './components/environment/FarmPlot'
import Trees from './components/environment/Trees'
import Decorations from './components/environment/Decorations'
import FarmSign from './components/environment/FarmSign'
import { FloatingParticles, Butterflies } from './components/environment/Effects'
import DynamicLighting from './components/environment/DynamicLighting'
import Player from './components/environment/Player'
import Pests from './components/environment/Pests'
import WeatherSystem from './components/environment/WeatherSystem'
import { useGameStore } from './store/gameStore'

function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0], type: 'Static' }))
  const grassPatches = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      key: i,
      position: [(Math.random() - 0.5) * 40, 0.006, (Math.random() - 0.5) * 40],
      rotation: [- Math.PI / 2, Math.random() * Math.PI, 0],
      radius: 0.5 + Math.random() * 1.5,
      hue: 110 + Math.random() * 20,
      sat: 50 + Math.random() * 20,
      light: 25 + Math.random() * 15,
    })), [])

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[80, 80, 40, 40]} />
        <meshStandardMaterial color="#3d6b35" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 4]} receiveShadow>
        <planeGeometry args={[2, 12]} />
        <meshStandardMaterial color="#a07828" roughness={1} />
      </mesh>
      {grassPatches.map(g => (
        <mesh key={g.key} rotation={g.rotation} position={g.position} receiveShadow>
          <circleGeometry args={[g.radius, 6]} />
          <meshStandardMaterial color={`hsl(${g.hue}, ${g.sat}%, ${g.light}%)`} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function FarmGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#5c3d1a" roughness={0.9} />
    </mesh>
  )
}

function Fence() {
  const posts = []
  const size = 7
  for (let i = -size; i <= size; i += 2) {
    posts.push(
      <FencePost key={`f-${i}`} position={[i, 0.4, -size]} />,
      <FencePost key={`b-${i}`} position={[i, 0.4, size]} />,
      <FencePost key={`l-${i}`} position={[-size, 0.4, i]} />,
      <FencePost key={`r-${i}`} position={[size, 0.4, i]} />
    )
  }
  return <group>{posts}</group>
}

function FencePost({ position }) {
  return (
    <group position={position}>
      <mesh castShadow><boxGeometry args={[0.15, 1.0, 0.15]} /><meshStandardMaterial color="#8B6914" roughness={0.8} /></mesh>
      <mesh castShadow position={[1, 0.1, 0]}><boxGeometry args={[2, 0.08, 0.1]} /><meshStandardMaterial color="#a07828" roughness={0.8} /></mesh>
      <mesh castShadow position={[1, -0.2, 0]}><boxGeometry args={[2, 0.08, 0.1]} /><meshStandardMaterial color="#a07828" roughness={0.8} /></mesh>
    </group>
  )
}

const Experience = () => {
  const plots = useGameStore(s => s.plots)
  return (
    <>
      <fog attach="fog" args={['#87CEEB', 25, 60]} />
      <DynamicLighting />
      <Physics gravity={[0, -9.8, 0]}>
        <Ground />
        <FarmGround />
        {plots.map(plot => <FarmPlot key={plot.id} plot={plot} />)}
      </Physics>
      <Fence />
      <Trees />
      <Decorations />
      <FarmSign />
      <Player />
      <Pests />
      <WeatherSystem />
      <FloatingParticles count={40} area={25} />
      <Butterflies count={4} />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} minDistance={8} maxDistance={30} target={[0, 0, 0]} enablePan={false} />
    </>
  )
}

export default Experience
