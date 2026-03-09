import { Sky } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

const DynamicLighting = () => {
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const weather = useGameStore(s => s.weather)

  const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2
  const sunHeight = Math.max(0, Math.sin(sunAngle)) * 60 + 5
  const sunX = Math.cos(sunAngle) * 100

  const isNight = timeOfDay > 0.6 || timeOfDay < 0.1
  const isDusk = timeOfDay > 0.45 && timeOfDay <= 0.6
  const isDawn = timeOfDay >= 0.1 && timeOfDay < 0.2

  let ambientIntensity = 0.5
  let dirIntensity = 1.2
  let dirColor = '#FFF5E0'
  let skyTurbidity = 3

  if (isNight) {
    ambientIntensity = 0.35
    dirIntensity = 0.25
    dirColor = '#6688cc'
    skyTurbidity = 8
  } else if (isDusk) {
    ambientIntensity = 0.3
    dirIntensity = 0.7
    dirColor = '#ff8844'
    skyTurbidity = 6
  } else if (isDawn) {
    ambientIntensity = 0.35
    dirIntensity = 0.8
    dirColor = '#ffaa66'
    skyTurbidity = 5
  }

  if (weather === 'rain' || weather === 'storm') {
    ambientIntensity *= 0.6
    dirIntensity *= 0.4
    dirColor = '#aabbcc'
    skyTurbidity = 15
  } else if (weather === 'drought') {
    dirIntensity *= 1.2
    dirColor = '#ffddaa'
    skyTurbidity = 1
  }

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[sunX, sunHeight, 8]}
        intensity={dirIntensity}
        color={dirColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-5, 8, -5]}
        intensity={isNight ? 0.15 : 0.3}
        color={isNight ? '#445577' : '#87CEEB'}
      />
      <Sky
        sunPosition={[sunX, sunHeight, 50]}
        turbidity={skyTurbidity}
        rayleigh={isNight ? 0.1 : 0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
    </>
  )
}

export default DynamicLighting
