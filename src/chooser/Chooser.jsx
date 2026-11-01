import './chooser.css'
import { profile } from '../shared/content'

const worlds = [
  {
    id: 'elden',
    href: '/elden-ring',
    kicker: 'Fantasia sombria',
    title: 'Elden Ring',
    text: 'Atributos, relíquias forjadas e locais de graça nas Terras Intermédias.',
    Emblem: RingEmblem,
  },
  {
    id: 'storm',
    href: '/stormlight',
    kicker: 'Fantasia épica',
    title: 'Stormlight Archive',
    text: 'Fluxos, fabriais e grantempestades sob a Luz das Tempestades.',
    Emblem: GemEmblem,
  },
]

// Tela inicial: escolha entre os dois portfólios
export default function Chooser() {
  return (
    <div className="chooser">
      <header className="chooser-head">
        <span className="chooser-name">{profile.name}</span>
        <span className="chooser-role">{profile.title}</span>
        <p className="chooser-ask">Escolha um mundo para conhecer meu trabalho</p>
      </header>
      <div className="worlds">
        {worlds.map(({ id, href, kicker, title, text, Emblem }) => (
          <a key={id} className={`world world-${id}`} href={href}>
            <span className="world-bg" aria-hidden="true" />
            <Emblem />
            <span className="world-body">
              <span className="world-kicker">{kicker}</span>
              <strong className="world-title">{title}</strong>
              <span className="world-text">{text}</span>
              <span className="world-cta">Entrar</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

// mesmo desenho do emblema da cena 3D do tema
function RingEmblem() {
  return (
    <svg className="world-emblem" viewBox="-5 -5 10 10" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle r="3.8" strokeWidth="0.1" />
        <circle cy="-1.05" r="1.45" strokeWidth="0.07" />
        <circle cx="-0.95" cy="0.75" r="1.9" strokeWidth="0.06" />
        <circle cx="0.95" cy="0.75" r="1.9" strokeWidth="0.06" />
        <path d="M -2.84 1.52 A 3.05 3.05 0 0 0 2.84 1.52" strokeWidth="0.05" />
        <path d="M 0 -4.6 V 4.6 M -1.5 2.45 H 1.5" strokeWidth="0.07" />
      </g>
    </svg>
  )
}

// gema lapidada dentro de um decagrama, como as dez esferas do tema
function GemEmblem() {
  const points = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    return [Math.cos(a) * 3.9, Math.sin(a) * 3.9]
  })
  const star = points.map((_, i) => points[(i * 3) % 10].join(',')).join(' ')
  return (
    <svg className="world-emblem" viewBox="-5 -5 10 10" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <polygon points={star} strokeWidth="0.04" strokeOpacity="0.55" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.22" fill="currentColor" fillOpacity="0.35" strokeWidth="0.04" />
        ))}
        <path d="M0 -2.2 L1.6 -0.5 L0 2.4 L-1.6 -0.5 Z" fill="currentColor" fillOpacity="0.15" strokeWidth="0.08" />
        <path d="M-1.6 -0.5 H1.6 M0 -2.2 L-0.6 -0.5 L0 2.4 L0.6 -0.5 Z" strokeWidth="0.045" strokeOpacity="0.7" />
      </g>
    </svg>
  )
}
