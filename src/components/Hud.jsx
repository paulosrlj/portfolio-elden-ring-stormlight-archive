import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollState } from '../scroll'

// Barras de HP / FP / Stamina + contador de runas
export function Hud() {
  const [progress, setProgress] = useState(0)
  const [stamina, setStamina] = useState(100)
  const last = useRef({ y: window.scrollY, t: performance.now() })

  useEffect(() => {
    let raf
    const tick = () => {
      const now = performance.now()
      const y = window.scrollY
      const dy = Math.abs(y - last.current.y)
      last.current = { y, t: now }
      // rolar rápido gasta stamina; parado ela regenera
      setStamina((s) => Math.max(5, Math.min(100, s - dy * 0.08 + 0.6)))
      setProgress(scrollState.progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const runes = Math.floor(progress * 99999)

  return (
    <>
      <div className="hud" aria-hidden="true">
        <div className="bar hp"><span style={{ width: '100%' }} /></div>
        <div className="bar fp"><span style={{ width: `${25 + progress * 75}%` }} /></div>
        <div className="bar st"><span style={{ width: `${stamina}%` }} /></div>
      </div>
      <div className="runes" aria-hidden="true">
        <RuneGlyph />
        <span>{runes.toLocaleString('pt-BR')}</span>
      </div>
    </>
  )
}

function RuneGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2v20M7 7l5 5 5-5M8 17h8" strokeLinecap="round" />
    </svg>
  )
}

// Tela inicial "pressione qualquer tecla"
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
          <motion.p
            className="intro-quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.6 }}
          >
            Levante-se, Maculado, e seja guiado pela graça
            <br />
            para explorar este portfólio.
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

// Aviso temporário estilo mensagem de jogo
export function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          className="toast"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="toast-line" />
          <strong>{message}</strong>
          <span className="toast-line" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
