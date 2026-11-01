import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile, about, surges, shardplate, projects, journey } from '../data'
import { GEMS, gemColor } from '../gems'

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
}

// Desloca o conteúdo em velocidade diferente do scroll (positivo = mais lento)
function Parallax({ speed = 60, className, children }) {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Título de seção com o Ideal correspondente
function IdealTitle({ ideal, children }) {
  return (
    <Parallax speed={70}>
      <motion.header
        className="region"
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      >
        <span className="region-kicker">{ideal}</span>
        <h2>{children}</h2>
        <motion.span
          className="region-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3 }}
        >
          <i />
        </motion.span>
      </motion.header>
    </Parallax>
  )
}

function Gem({ color, size = 40 }) {
  return (
    <svg className="gem" width={size} height={size} viewBox="0 0 40 40" style={{ color }}>
      <path d="M20 3 L33 15 L20 37 L7 15 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 15 H33 M20 3 L14 15 L20 37 L26 15 Z" fill="none" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
    </svg>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 260])
  const fade = useTransform(scrollY, [0, 600], [1, 0])
  return (
    <section id="inicio" className="section hero">
      <motion.div
        className="hero-inner"
        style={{ y, opacity: fade }}
        initial={{ filter: 'blur(12px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{ duration: 2, delay: 0.3 }}
      >
        <span className="hero-kicker">{profile.title}</span>
        <h1>{profile.name}</h1>
        <p className="hero-motto">
          {profile.motto.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.6, duration: 1.2 }}
            >
              {line}
            </motion.span>
          ))}
        </p>
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-actions">
          <a className="btn btn-light" href="#fabriais">Ver Fabriais</a>
          <a className="btn" href="#palavras">Dizer as Palavras</a>
        </div>
      </motion.div>
      <a className="scroll-hint" href="#jornada" aria-label="Rolar para baixo">
        <span />
      </a>
    </section>
  )
}

export function About() {
  return (
    <section id="jornada" className="section">
      <IdealTitle ideal="Primeiro Ideal">A Jornada</IdealTitle>
      <motion.div className="panel prose" {...reveal}>
        {about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <dl className="facts">
          <div><dt>Ordem</dt><dd>{profile.title}</dd></div>
          <div><dt>Origem</dt><dd>{profile.location}</dd></div>
          <div><dt>Idiomas</dt><dd>{profile.languages}</dd></div>
        </dl>
      </motion.div>
    </section>
  )
}

export function Surges() {
  return (
    <section id="fluxos" className="section">
      <IdealTitle ideal="Segundo Ideal">Fluxos Dominados</IdealTitle>
      <div className="stats-grid">
        <motion.div className="panel" {...reveal}>
          <div className="panel-head">
            <span>Fluxo</span>
            <span>Luz contida</span>
          </div>
          <ul className="surge-list">
            {surges.map((s, i) => (
              <li key={s.name}>
                <span className="surge-name">{s.surge}</span>
                <span className="surge-skill">{s.name}</span>
                <span className="surge-pips" aria-label={`${s.value} de 10`}>
                  {Array.from({ length: 10 }, (_, k) => (
                    <motion.i
                      key={k}
                      className={k < s.value ? 'on' : ''}
                      style={{ '--gem': GEMS[k].color }}
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * i + 0.04 * k, duration: 0.5 }}
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div className="panel" {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
          <div className="panel-head">
            <span>Armadura Fractal</span>
          </div>
          <ul className="equip-list">
            {shardplate.map((e, i) => (
              <li key={i}>
                <span className="equip-slot">{e.piece}</span>
                <span className="equip-item">{e.item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export function Projects() {
  return (
    <section id="fabriais" className="section">
      <IdealTitle ideal="Terceiro Ideal">Fabriais Construídos</IdealTitle>
      <div className="items-grid">
        {projects.map((p, i) => {
          const color = gemColor(p.gem)
          return (
            <Parallax key={p.name} speed={i % 2 ? 50 : 15}>
              <motion.article
                className="item-card"
                style={{ '--gem': color }}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
              >
                <div className="item-top">
                  <Gem color={color} size={54} />
                  <div>
                    <h3>{p.name}</h3>
                    <span className="item-type">{p.type}</span>
                  </div>
                </div>
                <div className="essence">
                  Gema: <b>{p.gem}</b>
                </div>
                <p className="item-desc">{p.description}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                {(p.link || p.repo) && (
                  <div className="item-links">
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer">Ativar ↗</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Código ↗</a>}
                  </div>
                )}
              </motion.article>
            </Parallax>
          )
        })}
      </div>
    </section>
  )
}

export function Journey() {
  return (
    <section id="tempestades" className="section">
      <IdealTitle ideal="Quarto Ideal">Experiência profissional</IdealTitle>
      <ol className="timeline">
        {journey.map((j, i) => (
          <motion.li key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.15 }}>
            <span className="tl-gem">
              <Gem color={GEMS[(i * 3) % GEMS.length].color} size={26} />
            </span>
            <span className="tl-period">{j.period}</span>
            <h3>{j.place}</h3>
            <span className="tl-role">{j.role}</span>
            <p>{j.text}</p>
            {j.highlights && (
              <ul className="tl-highlights">
                {j.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

export function Contact({ onSpeak }) {
  return (
    <section id="palavras" className="section contact">
      <IdealTitle ideal="Quinto Ideal">Diga as Palavras</IdealTitle>
      <motion.div className="oath" {...reveal}>
        <button className="oath-sphere" onClick={onSpeak} aria-label="Pronunciar as Palavras">
          <span className="oath-core" />
          <span className="oath-ring" />
          <span className="oath-ring r2" />
        </button>
        <p className="oath-text">
          Toda jornada começa com um juramento. Fale comigo e vamos construir algo juntos.
        </p>
        <div className="contact-links">
          <a className="btn btn-light" href={`mailto:${profile.email}`}>Enviar Mensagem</a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          {profile.cv && <a className="btn" href={profile.cv}>Currículo</a>}
        </div>
      </motion.div>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} · Portfólio inspirado em fantasia épica
      </footer>
    </section>
  )
}
