import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollState } from '../../shared/scroll'

const IDEALS = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto', 'Quinto']

// Luz das Tempestades acumulada, esferas infundidas e Ideais jurados
export function Hud() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      setProgress(scrollState.progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const spheres = Math.min(10, Math.floor(progress * 11))
  const ideals = Math.min(5, Math.floor(progress * 5.2 + 0.2))

  return (
    <>
      <div className="hud" aria-hidden="true">
        <span className="hud-label">Luz das Tempestades</span>
        <div className="stormlight">
          <span style={{ width: `${8 + progress * 92}%` }} />
        </div>
        <div className="ideals">
          {IDEALS.map((name, i) => (
            <span key={name} className={i < ideals ? 'sworn' : ''} title={`${name} Ideal`} />
          ))}
        </div>
      </div>
      <div className="spheres-count" aria-hidden="true">
        <SphereGlyph />
        <span>{spheres} / 10 esferas</span>
      </div>
    </>
  )
}

function SphereGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6 L16 12 L12 18 L8 12 Z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  )
}

// Tela inicial: aviso de grantempestade
export function Intro({ onStart }) {
  const [visible, setVisible] = useState(() => !new URLSearchParams(location.search).has('nointro'))
  useEffect(() => {
    const start = () => setVisible(false)
    window.addEventListener('keydown', start, { once: true })
    window.addEventListener('wheel', start, { once: true })
    window.addEventListener('touchstart', start, { once: true })
    return () => {
      window.removeEventListener('keydown', start)
      window.removeEventListener('wheel', start)
      window.removeEventListener('touchstart', start)
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={onStart}>
      {visible && (
        <motion.div
          className="intro"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.4, ease: 'easeInOut' } }}
        >
          <motion.span
            className="intro-kicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.4 }}
          >
            Aviso de grantempestade
          </motion.span>
          <motion.p
            className="intro-quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.6 }}
          >
            O paredão se aproxima pelo leste.
            <br />
            Deixe suas esferas ao vento — elas voltarão cheias de Luz.
          </motion.p>
          <motion.span
            className="intro-press"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.35, 1] }}
            transition={{ delay: 2, duration: 2.4, repeat: Infinity, repeatType: 'reverse' }}
          >
            Pressione qualquer tecla
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Aviso temporário com título e subtítulo
export function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.msg}
          className="toast"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {toast.sub && <span className="toast-sub">{toast.sub}</span>}
          <span className="toast-line" />
          <strong>{toast.msg}</strong>
          <span className="toast-line" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
