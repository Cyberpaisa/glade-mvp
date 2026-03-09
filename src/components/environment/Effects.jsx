import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export function FloatingParticles({ count = 50, area = 20 }) {
  const meshRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area
      positions[i * 3 + 1] = Math.random() * 5 + 0.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * area
      speeds[i] = Math.random() * 0.5 + 0.2
    }
    return { positions, speeds }
  }, [count, area])

  useFrame((state) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * particles.speeds[i] + i) * 0.003
      positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.002
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#f1c40f"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export function Butterflies({ count = 5 }) {
  const groupRef = useRef()

  const butterflies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      offset: Math.random() * Math.PI * 2,
      radius: 3 + Math.random() * 8,
      height: 1 + Math.random() * 3,
      speed: 0.3 + Math.random() * 0.5,
      color: ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#2ecc71'][i % 5]
    })), [count])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const b = butterflies[i]
      const t = state.clock.elapsedTime * b.speed + b.offset
      child.position.x = Math.cos(t) * b.radius
      child.position.z = Math.sin(t) * b.radius
      child.position.y = b.height + Math.sin(t * 3) * 0.5
      child.rotation.y = t + Math.PI / 2
    })
  })

  return (
    <group ref={groupRef}>
      {butterflies.map((b, i) => (
        <group key={i}>
          <mesh position={[-0.08, 0, 0]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshStandardMaterial color={b.color} side={2} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.08, 0, 0]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshStandardMaterial color={b.color} side={2} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
