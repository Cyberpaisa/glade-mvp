import React from 'react'

function Tree({ position, scale = 1, color = '#2d7a2d' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.12, 0.18, 1.2, 6]} /><meshStandardMaterial color="#6b3e12" /></mesh>
      <mesh position={[0, 1.6, 0]} castShadow><coneGeometry args={[0.8, 1.2, 7]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 2.2, 0]} castShadow><coneGeometry args={[0.6, 1.0, 7]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 2.7, 0]} castShadow><coneGeometry args={[0.35, 0.7, 7]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  )
}

function CoffeeTree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.08, 0.12, 1, 6]} /><meshStandardMaterial color="#5c3d1a" /></mesh>
      <mesh position={[0, 1.2, 0]} castShadow><sphereGeometry args={[0.6, 8, 8]} /><meshStandardMaterial color="#2d5a1e" /></mesh>
      <mesh position={[0.3, 1.0, 0.2]} castShadow><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#c0392b" /></mesh>
      <mesh position={[-0.2, 1.1, -0.3]} castShadow><sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#c0392b" /></mesh>
      <mesh position={[0.1, 0.9, 0.4]} castShadow><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#e74c3c" /></mesh>
    </group>
  )
}

const Trees = () => (
  <group>
    <Tree position={[-12, 0, -10]} scale={1.3} />
    <Tree position={[-10, 0, -12]} scale={1.0} color="#1e6b1e" />
    <Tree position={[-14, 0, -8]} scale={1.5} />
    <Tree position={[12, 0, -10]} scale={1.2} color="#287a28" />
    <Tree position={[14, 0, -12]} scale={1.4} />
    <Tree position={[10, 0, -14]} scale={1.1} color="#1e6b1e" />
    <Tree position={[-14, 0, 2]} scale={1.3} />
    <Tree position={[14, 0, 4]} scale={1.4} />
    <CoffeeTree position={[-9, 0, 4]} />
    <CoffeeTree position={[-10, 0, 6]} />
    <CoffeeTree position={[9, 0, 5]} />
    <CoffeeTree position={[10, 0, 3]} />
    <Tree position={[-4, 0, 14]} scale={1.2} color="#287a28" />
    <Tree position={[4, 0, 14]} scale={1.5} />
    <Tree position={[0, 0, 16]} scale={1.3} color="#1e6b1e" />
  </group>
)
export default Trees
