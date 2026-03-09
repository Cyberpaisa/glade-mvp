import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Experience from './Experience'
import GameUI from './components/ui/GameUI'
import PlantMenu from './components/ui/PlantMenu'
import YieldDashboard from './components/ui/YieldDashboard'
import Notifications from './components/ui/Notifications'
import WeatherHUD from './components/ui/WeatherHUD'
import CardCollection from './components/ui/CardCollection'
import HybridLab from './components/ui/HybridLab'
import Tutorial from './components/ui/Tutorial'
import { useGameStore } from './store/gameStore'
import './styles.css'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
]

const App = () => {
  const updatePlantGrowth = useGameStore(s => s.updatePlantGrowth)
  const updateTimeAndWeather = useGameStore(s => s.updateTimeAndWeather)
  const spawnPest = useGameStore(s => s.spawnPest)
  const updatePests = useGameStore(s => s.updatePests)
  const collectStakingRewards = useGameStore(s => s.collectStakingRewards)

  useEffect(() => {
    const growthInterval = setInterval(() => {
      updatePlantGrowth()
      updateTimeAndWeather()
      collectStakingRewards()
    }, 1000)
    const pestSpawnInterval = setInterval(spawnPest, 2000)
    const pestMoveInterval = setInterval(updatePests, 100)
    return () => {
      clearInterval(growthInterval)
      clearInterval(pestSpawnInterval)
      clearInterval(pestMoveInterval)
    }
  }, [updatePlantGrowth, updateTimeAndWeather, spawnPest, updatePests, collectStakingRewards])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 12, 16], fov: 50 }} gl={{ antialias: true }}>
          <Experience />
        </Canvas>
      </KeyboardControls>
      <GameUI />
      <WeatherHUD />
      <PlantMenu />
      <YieldDashboard />
      <CardCollection />
      <HybridLab />
      <Tutorial />
      <Notifications />
      <div className="controls-hint">
        <span>WASD: Mover</span>
        <span>Click parcela: Comprar/Cosechar</span>
        <span>Click plaga: Eliminar</span>
        <span>Rotar camara: Click + Arrastrar</span>
      </div>
    </div>
  )
}

export default App
