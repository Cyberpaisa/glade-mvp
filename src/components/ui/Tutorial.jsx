import { useGameStore } from '../../store/gameStore'

const STEPS = [
  {
    title: 'Bienvenido a GLADE',
    text: 'GLADE es una granja 3D donde cada semilla que compras invierte en Activos del Mundo Real (RWA). Tu granja genera rendimientos reales.',
    icon: '🌱',
  },
  {
    title: 'Economia 75/25',
    text: '75% de cada compra va al Pool RWA (cafe, vinedos, paneles solares). 25% va al Pool del Juego (rewards, packs, staking).',
    icon: '💰',
  },
  {
    title: 'Como Plantar',
    text: 'Haz click en una parcela vacia para comprar una semilla RWA. Elige entre: Cafe ($10), Cacao ($15), Vinedo ($25) o Panel Solar ($50).',
    icon: '🌿',
  },
  {
    title: 'Seed Cards',
    text: 'Compra packs de cartas ($2 o $6 gUSD) en la Coleccion. Las cartas tienen rareza (Common → Legendary) y traits que multiplican tu yield.',
    icon: '🃏',
  },
  {
    title: 'Laboratorio Hibrido',
    text: 'Combina 2 cartas en el Lab para crear hibridos con mejores stats. Los hibridos pueden subir de rareza y heredar traits de ambos padres.',
    icon: '🧬',
  },
  {
    title: 'Clima y Plagas',
    text: 'El clima cambia cada dia: Sol (normal), Lluvia (1.5x growth), Sequia (0.5x), Tormenta (daña plantas). Las plagas atacan — click para eliminarlas y ganar gUSD.',
    icon: '⛈️',
  },
  {
    title: 'Staking',
    text: 'Las cartas Rare+ se pueden stakear para ganar yield pasivo del Game Pool. Legendary = 5%, Epic = 3%, Rare = 1% por tick.',
    icon: '🏦',
  },
  {
    title: 'Tips de Rentabilidad',
    text: 'Invierte en Solar ($50) para max yield. Compra packs y stakea Rare+ cards. Defiende tus plantas de plagas. Hibridiza para cards legendarias con traits como Doble Cosecha o Alto Rendimiento.',
    icon: '📈',
  },
  {
    title: 'Controles',
    text: 'WASD: Mover personaje. Click parcela: Comprar/Cosechar. Click plaga: Eliminar. Rotar camara: Click + Arrastrar. Usa los botones Cards y Lab en el HUD.',
    icon: '🎮',
  },
]

const Tutorial = () => {
  const showTutorial = useGameStore(s => s.showTutorial)
  const tutorialStep = useGameStore(s => s.tutorialStep)
  const nextTutorialStep = useGameStore(s => s.nextTutorialStep)
  const closeTutorial = useGameStore(s => s.closeTutorial)

  if (!showTutorial) return null

  const step = STEPS[tutorialStep]
  if (!step) { closeTutorial(); return null }

  const isLast = tutorialStep === STEPS.length - 1

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-icon">{step.icon}</div>
        <h2 className="tutorial-title">{step.title}</h2>
        <p className="tutorial-text">{step.text}</p>
        <div className="tutorial-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`tutorial-dot ${i === tutorialStep ? 'active' : ''} ${i < tutorialStep ? 'done' : ''}`} />
          ))}
        </div>
        <div className="tutorial-buttons">
          <button className="btn-cancel" onClick={closeTutorial}>Saltar</button>
          <button className="btn-plant" onClick={isLast ? closeTutorial : nextTutorialStep}>
            {isLast ? 'Empezar!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
