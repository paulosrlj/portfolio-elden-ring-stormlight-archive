import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile, about, level, attributes, equipment, projects, journey } from '../data'

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

// Título estilo "nova região descoberta"
function RegionTitle({ kicker, children }) {
  return (
    <Parallax speed={70}>
      <motion.header
        className="region"
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.18em' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <span className="region-kicker">{kicker}</span>
        <h2>{children}</h2>
        <motion.span
          className="region-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3 }}
        />
      </motion.header>
    </Parallax>
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
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#projetos">Ver Relíquias</a>
          <a className="btn" href="#graca">Descansar na Graça</a>
        </div>
      </motion.div>
      <a className="scroll-hint" href="#sobre" aria-label="Rolar para baixo">
        <span />
      </a>
    </section>
  )
}

export function About() {
  return (
    <section id="sobre" className="section">
      <RegionTitle kicker="Capítulo I">A Origem</RegionTitle>
      <motion.div className="panel prose" {...reveal}>
        {about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <dl className="facts">
          <div><dt>Classe</dt><dd>{profile.title}</dd></div>
          <div><dt>Origem</dt><dd>{profile.location}</dd></div>
          <div><dt>Idiomas</dt><dd>{profile.languages}</dd></div>
          <div><dt>Nível</dt><dd>{level}</dd></div>
        </dl>
      </motion.div>
    </section>
  )
}

export function Attributes() {
  return (
    <section id="atributos" className="section">
      <RegionTitle kicker="Capítulo II">Atributos</RegionTitle>
      <div className="stats-grid">
        <motion.div className="panel" {...reveal}>
          <div className="panel-head">
            <span>Nível</span>
            <strong className="level">{level}</strong>
          </div>
          <ul className="attr-list">
            {attributes.map((a, i) => (
              <li key={a.name}>
                <span className="attr-short">{a.short}</span>
                <span className="attr-name">{a.name}</span>
                <span className="attr-bar">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: a.value / 99 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 * i, ease: 'easeOut' }}
                  />
                </span>
                <span className="attr-value">{a.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div className="panel" {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
          <div className="panel-head">
            <span>Equipamento</span>
          </div>
          <ul className="equip-list">
            {equipment.map((e, i) => (
              <li key={i}>
                <span className="equip-slot">{e.slot}</span>
                <span className="equip-item">{e.item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

const glyphs = {
  sword: <path d="M6 42 L36 12 L42 6 L40 14 L10 44 M14 34 l4 4 M8 36 l6 6" />,
  shield: <path d="M24 4 L40 10 V24 C40 34 32 41 24 44 C16 41 8 34 8 24 V10 Z M24 12 V36 M16 22 H32" />,
  seal: <path d="M24 4 A20 20 0 1 0 24.01 4 M24 12 A12 12 0 1 0 24.01 12 M24 4 V12 M24 36 V44 M4 24 H12 M36 24 H44" />,
  tome: <path d="M8 8 H22 C24 8 24 10 24 10 C24 10 24 8 26 8 H40 V40 H26 C24 40 24 42 24 42 C24 42 24 40 22 40 H8 Z M24 10 V42 M13 16 H19 M29 16 H35" />,
}

export function Projects() {
  return (
    <section id="projetos" className="section">
      <RegionTitle kicker="Capítulo III">Relíquias Forjadas</RegionTitle>
      <div className="items-grid">
        {projects.map((p, i) => (
          <Parallax key={p.name} speed={i % 2 ? 50 : 15}>
            <motion.article
              className="item-card"
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <div className="item-top">
                <svg className="item-glyph" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {glyphs[p.glyph]}
                </svg>
                <div>
                  <h3>{p.name}</h3>
                  <span className="item-type">{p.type}</span>
                </div>
              </div>
              <div className="scaling">
                {Object.entries(p.scaling).map(([k, v]) => (
                  <span key={k}>
                    {k} <b data-grade={v}>{v}</b>
                  </span>
                ))}
              </div>
              <p className="item-desc">{p.description}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {(p.link || p.repo) && (
                <div className="item-links">
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer">Empunhar ↗</a>}
                  {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Código ↗</a>}
                </div>
              )}
            </motion.article>
          </Parallax>
        ))}
      </div>
    </section>
  )
}

export function Journey() {
  return (
    <section id="jornada" className="section">
      <RegionTitle kicker="Capítulo IV">Experiência profissional</RegionTitle>
      <ol className="timeline">
        {journey.map((j, i) => (
          <motion.li key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.15 }}>
            <span className="grace-dot" />
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

export function Contact({ onRest }) {
  return (
    <section id="graca" className="section contact">
      <RegionTitle kicker="Capítulo Final">Local de Graça</RegionTitle>
      <motion.div className="grace" {...reveal}>
        <button className="grace-light" onClick={onRest} aria-label="Descansar na graça">
          <span className="grace-core" />
          <span className="grace-ring" />
          <span className="grace-ring r2" />
        </button>
        <p className="grace-text">
          Uma nova jornada pode começar aqui. Toque na graça e deixe sua mensagem.
        </p>
        <div className="contact-links">
          <a className="btn btn-gold" href={`mailto:${profile.email}`}>Enviar Mensagem</a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          {profile.cv && <a className="btn" href={profile.cv}>Currículo</a>}
        </div>
      </motion.div>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} · Portfólio inspirado na estética de fantasia sombria
      </footer>
    </section>
  )
}
