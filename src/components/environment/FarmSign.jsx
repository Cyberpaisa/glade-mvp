import React from 'react'
import { Html } from '@react-three/drei'
const FarmSign = () => (
  <group position={[0, 0, -8]}>
    <mesh position={[-1.2, 0.8, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.6, 6]} /><meshStandardMaterial color="#5c3310" /></mesh>
    <mesh position={[1.2, 0.8, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.6, 6]} /><meshStandardMaterial color="#5c3310" /></mesh>
    <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[3.5, 0.8, 0.12]} /><meshStandardMaterial color="#8B6914" /></mesh>
    <Html position={[0, 1.5, 0.08]} center transform>
      <div style={{ fontFamily: 'Fredoka', fontSize: 16, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', userSelect: 'none' }}>
        GLADE — Real Yield Farm
      </div>
    </Html>
  </group>
)
export default FarmSign
