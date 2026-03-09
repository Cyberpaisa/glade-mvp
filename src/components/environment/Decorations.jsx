import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Barn({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[4, 2.4, 3]} /><meshStandardMaterial color="#8B4513" /></mesh>
      <mesh position={[0, 2.8, 0]} castShadow><coneGeometry args={[3, 1.5, 4]} /><meshStandardMaterial color="#c0392b" /></mesh>
      <mesh position={[0, 0.7, 1.51]}><planeGeometry args={[1.2, 1.8]} /><meshStandardMaterial color="#5c3310" /></mesh>
      <mesh position={[-1.2, 1.5, 1.51]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.1} /></mesh>
      <mesh position={[1.2, 1.5, 1.51]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.1} /></mesh>
    </group>
  )
}

function Windmill({ position }) {
  const bladesRef = useRef()
  useFrame(() => { if (bladesRef.current) bladesRef.current.rotation.z += 0.008 })
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow><cylinderGeometry args={[0.3, 0.5, 4, 8]} /><meshStandardMaterial color="#d5d5d5" /></mesh>
      <mesh position={[0, 4.2, 0]} castShadow><coneGeometry args={[0.5, 0.8, 8]} /><meshStandardMaterial color="#c0392b" /></mesh>
      <group ref={bladesRef} position={[0, 3.5, 0.35]}>
        {[0,1,2,3].map(i => <mesh key={i} rotation={[0, 0, (Math.PI/2)*i]}><boxGeometry args={[0.15, 1.8, 0.03]} /><meshStandardMaterial color="#f5f5f5" /></mesh>)}
      </group>
    </group>
  )
}

function SolarPanel({ position }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 1, 6]} /><meshStandardMaterial color="#666" /></mesh>
      <mesh position={[0, 1.0, 0]} rotation={[-0.3, 0, 0]} castShadow><boxGeometry args={[1.5, 0.05, 1]} /><meshStandardMaterial color="#1a3a5c" metalness={0.8} roughness={0.2} /></mesh>
    </group>
  )
}

function Flower({ position, color = '#e74c3c' }) {
  const ref = useRef()
  useFrame((state) => { if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1 })
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.015, 0.02, 0.3, 4]} /><meshStandardMaterial color="#2d5a1e" /></mesh>
      <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.08, 6, 6]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} /></mesh>
    </group>
  )
}

const Decorations = () => (
  <group>
    <Barn position={[10, 0, -4]} />
    <Windmill position={[-10, 0, -4]} />
    <SolarPanel position={[-10, 0, 5]} />
    <SolarPanel position={[-11.5, 0, 5]} />
    <SolarPanel position={[-10, 0, 6.5]} />
    <Flower position={[-9, 0, 2]} color="#e74c3c" />
    <Flower position={[-9.5, 0, 3]} color="#f39c12" />
    <Flower position={[9, 0, -8]} color="#e74c3c" />
    <Flower position={[5, 0, 9]} color="#9b59b6" />
    <Flower position={[4, 0, 9.5]} color="#2ecc71" />
  </group>
)
export default Decorations
