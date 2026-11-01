import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Hud, Intro, Toast } from './components/Hud'
import { Hero, About, Attributes, Projects, Journey, Contact } from './components/Sections'
import { scrollState } from '../shared/scroll'
import './index.css'

const scenes = {
  anel: { label: 'Anel', Component: lazy(() => import('./components/RingScene')) },
  arvore: { label: 'Árvore', Component: lazy(() => import('./components/Scene')) },
}

const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Origem' },
  { id: 'atributos', label: 'Atributos' },
  { id: 'projetos', label: 'Relíquias' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'graca', label: 'Graça' },
]

export default function App() {
  const [scene, setScene] = useState(() => {
    const param = new URLSearchParams(location.search).get('cena')
    return scenes[param] ? param : 'anel'
  })
  const [active, setActive] = useState('inicio')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? window.scrollY / max : 0
      // usado pelo CSS para escurecer o fundo atrás do texto
      document.documentElement.style.setProperty('--scroll', scrollState.progress)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    nav.forEach((n) => io.observe(document.getElementById(n.id)))
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const switchScene = () => {
    const next = scene === 'anel' ? 'arvore' : 'anel'
    setScene(next)
    const url = new URL(location.href)
    url.searchParams.set('cena', next)
    history.replaceState(null, '', url)
  }

  const SceneComponent = scenes[scene].Component

  const showToast = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }

  return (
    <>
      <Suspense fallback={null}>
        <SceneComponent key={scene} />
      </Suspense>
      <div className="scrim" aria-hidden="true" />
      <Intro onStart={() => showToast('Local de Graça Descoberto')} />
      <Hud />
      <a className="portfolio-switch" href="/">Trocar portfólio</a>
      <nav className="side-nav" aria-label="Seções">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''}>
            <span className="nav-label">{n.label}</span>
            <span className="nav-dot" />
          </a>
        ))}
      </nav>
      <main>
        <Hero />
        <About />
        <Attributes />
        <Projects />
        <Journey />
        <Contact onRest={() => showToast('Você descansou na graça')} />
      </main>
      <Toast message={toast} />
      <button className="scene-switch" onClick={switchScene}>
        Cena: <b>{scenes[scene].label}</b>
      </button>
    </>
  )
}
