import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Hud, Intro, Toast } from './components/Hud'
import { Hero, About, Surges, Projects, Journey, Contact } from './components/Sections'
import { scrollState } from '../shared/scroll'
import './index.css'

const StormScene = lazy(() => import('./components/StormScene'))

const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'jornada', label: 'Jornada' },
  { id: 'fluxos', label: 'Fluxos' },
  { id: 'fabriais', label: 'Fabriais' },
  { id: 'tempestades', label: 'Tempestades' },
  { id: 'palavras', label: 'Palavras' },
]

export default function App() {
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

  const showToast = (msg, sub) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, sub })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      <Suspense fallback={null}>
        <StormScene />
      </Suspense>
      <div className="scrim" aria-hidden="true" />
      <Intro onStart={() => showToast('Vida antes da morte', 'Primeiro Ideal')} />
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
        <Surges />
        <Projects />
        <Journey />
        <Contact onSpeak={() => showToast('Estas palavras foram aceitas', 'Quinto Ideal')} />
      </main>
      <Toast toast={toast} />
    </>
  )
}
