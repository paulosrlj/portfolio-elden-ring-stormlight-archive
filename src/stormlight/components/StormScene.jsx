import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { scrollState } from '../../shared/scroll'
import { mulberry32, makeGlowTexture } from '../../shared/three-utils'
import { GEMS } from '../gems'

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Estado compartilhado da cena: scroll suavizado, força da tempestade e clarão do relâmpago
const world = { p: 0, storm: 0, flash: 0 }

function makeCloudTexture(seed) {
  const rand = mulberry32(seed)
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  for (let i = 0; i < 26; i++) {
    const x = 50 + rand() * 156
    const y = 70 + rand() * 116
    const r = 30 + rand() * 60
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Paredão da grantempestade: nuvens que escurecem e clareiam com os relâmpagos
function StormWall() {
  const textures = useMemo(() => [1, 2, 3].map(makeCloudTexture), [])
  const clouds = useMemo(() => {
    const rand = mulberry32(5)
    return Array.from({ length: 36 }, (_, i) => ({
      x: (rand() - 0.5) * 70,
      y: 4 + rand() * 12,
      z: -18 - rand() * 18,
      s: 14 + rand() * 16,
      speed: 0.3 + rand() * 0.6,
      tex: i % 3,
    }))
  }, [])
  const refs = useRef([])
  const base = useMemo(() => new THREE.Color('#1c2740'), [])
  const lit = useMemo(() => new THREE.Color('#b9d6ff'), [])

  useFrame((_, delta) => {
    clouds.forEach((c, i) => {
      const m = refs.current[i]
      m.position.x += c.speed * delta * (0.4 + world.storm * 2.5)
      if (m.position.x > 40) m.position.x = -40
      m.position.y = c.y - world.p * 3
      m.material.color.copy(base).lerp(lit, world.flash * 0.6)
      m.material.opacity = 0.55 + world.storm * 0.35
    })
  })

  return clouds.map((c, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[c.x, c.y, c.z]}>
      <planeGeometry args={[c.s * 1.6, c.s]} />
      <meshBasicMaterial map={textures[c.tex]} transparent depthWrite={false} fog={false} />
    </mesh>
  ))
}

function Lightning() {
  const line = useRef()
  const light = useRef()
  const state = useRef({ next: 2 })
  const rand = useMemo(() => mulberry32(77), [])
  const positions = useMemo(() => new Float32Array(40 * 3), [])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    if (t > state.current.next) {
      // novo raio: zigue-zague do céu até os planaltos
      let x = (rand() - 0.5) * 40
      let y = 16
      const z = -20 - rand() * 8
      for (let i = 0; i < 40; i++) {
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        x += (rand() - 0.5) * 1.6
        y -= 0.5 + rand() * 0.2
      }
      line.current.geometry.attributes.position.needsUpdate = true
      world.flash = 1
      state.current.next = t + (1 + rand() * 5) / (0.3 + world.storm)
    }
    world.flash = Math.max(0, world.flash - delta * 2.8)
    // tremulação típica do relâmpago
    const f = world.flash * (0.6 + Math.random() * 0.4)
    line.current.material.opacity = f > 0.35 ? f : 0
    light.current.intensity = f * 40 * (0.4 + world.storm)
  })

  return (
    <>
      <line ref={line}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e6f6ff" transparent toneMapped={false} fog={false} />
      </line>
      <pointLight ref={light} position={[0, 12, -10]} color="#bcdcff" distance={60} />
    </>
  )
}

function Rain({ count }) {
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const rand = mulberry32(9)
    const positions = new Float32Array(count * 6)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 40
      const y = (rand() - 0.5) * 30
      const z = (rand() - 0.5) * 20 - 2
      positions.set([x, y, z, x + 0.25, y + 0.9, z], i * 6)
      speeds[i] = 14 + rand() * 8
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, delta) => {
    const arr = ref.current.geometry.attributes.position.array
    const wind = 2 + world.storm * 6
    for (let i = 0; i < count; i++) {
      const o = i * 6
      const dy = speeds[i] * delta
      const dx = -wind * delta
      arr[o] += dx; arr[o + 3] += dx
      arr[o + 1] -= dy; arr[o + 4] -= dy
      if (arr[o + 1] < -15) {
        arr[o + 1] += 30; arr[o + 4] += 30
      }
      if (arr[o] < -20) {
        arr[o] += 40; arr[o + 3] += 40
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.setDrawRange(0, Math.floor(count * world.storm) * 2)
  })

  return (
    <lineSegments ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#9bb8d8" transparent opacity={0.35} />
    </lineSegments>
  )
}

// Silhueta de planaltos separados por abismos
function plateauGeometry(seed, width, height) {
  const rand = mulberry32(seed)
  const shape = new THREE.Shape()
  let x = -width / 2
  shape.moveTo(x, -20)
  while (x < width / 2) {
    const top = height * (0.4 + rand() * 0.6)
    const w = 2 + rand() * 6
    shape.lineTo(x, top)
    shape.lineTo(x + w * 0.1, top + rand() * 0.2)
    shape.lineTo(x + w * 0.9, top + rand() * 0.2)
    shape.lineTo(x + w, top)
    shape.lineTo(x + w, -3) // abismo
    x += w + 0.3 + rand() * 0.9
    shape.lineTo(x, -3)
  }
  shape.lineTo(x, -20)
  return new THREE.ShapeGeometry(shape)
}

const LAYERS = [
  { seed: 4, z: -16, y: -4, color: '#16203a', height: 3.2, speed: 3, mouse: 0.4 },
  { seed: 8, z: -9, y: -5.2, color: '#0e1528', height: 2.6, speed: 6, mouse: 0.9 },
  { seed: 12, z: -3, y: -6, color: '#070b16', height: 1.8, speed: 10, mouse: 1.6 },
]

function Plateaus() {
  const refs = useRef([])
  const { pointer } = useThree()
  const geos = useMemo(() => LAYERS.map((l) => plateauGeometry(l.seed, 120, l.height)), [])
  const lit = useMemo(() => new THREE.Color('#3a5480'), [])
  const colors = useMemo(() => LAYERS.map((l) => new THREE.Color(l.color)), [])

  useFrame(() => {
    LAYERS.forEach((l, i) => {
      const m = refs.current[i]
      m.position.y = l.y - world.p * l.speed
      m.position.x = -pointer.x * l.mouse
      m.material.color.copy(colors[i]).lerp(lit, world.flash * (0.5 - i * 0.15))
    })
  })

  return LAYERS.map((l, i) => (
    <mesh key={l.seed} ref={(el) => (refs.current[i] = el)} geometry={geos[i]} position={[0, l.y, l.z]}>
      <meshBasicMaterial color={l.color} />
    </mesh>
  ))
}

// Dez esferas que se infundem de Luz das Tempestades conforme o scroll
function Spheres() {
  const glow = useMemo(makeGlowTexture, [])
  const group = useRef()
  const gems = useRef([])
  const halos = useRef([])
  const chords = useRef()
  const circle = useRef()
  const R = 3.3

  const items = useMemo(
    () =>
      GEMS.map((g, i) => {
        const a = Math.PI / 2 - (i / GEMS.length) * Math.PI * 2
        return {
          ...g,
          pos: [Math.cos(a) * R, Math.sin(a) * R, 0],
          col: new THREE.Color(g.color),
          threshold: 0.06 + i * 0.075,
        }
      }),
    [],
  )

  // decagrama ligando as esferas, revelado quando todas estão infundidas
  const chordPositions = useMemo(() => {
    const arr = []
    items.forEach((it, i) => arr.push(...it.pos, ...items[(i + 3) % items.length].pos))
    return new Float32Array(arr)
  }, [items])
  const circlePositions = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      arr.push(Math.cos(a) * R, Math.sin(a) * R, 0)
    }
    return new Float32Array(arr)
  }, [])

  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = world.p
    const complete = smoothstep(0.86, 1, p)
    group.current.rotation.z = t * 0.04
    group.current.position.y = 0.8 + Math.sin(t * 0.6) * 0.08

    items.forEach((it, i) => {
      const lit = smoothstep(it.threshold, it.threshold + 0.06, p)
      const pulse = 1 + Math.sin(t * 2.2 + i) * 0.15
      tmp.copy(it.col).multiplyScalar(0.12 + lit * (2.2 + complete) * pulse)
      gems.current[i].material.color.copy(tmp)
      gems.current[i].rotation.set(t * 0.5 + i, t * 0.7, 0)
      const h = halos.current[i]
      const s = 0.4 + lit * (1.8 + complete * 0.8) * pulse
      h.scale.set(s, s, 1)
      h.material.opacity = lit * 0.9
    })
    chords.current.material.opacity = complete * 0.7
    circle.current.material.opacity = 0.12 + p * 0.3 + complete * 0.4
  })

  return (
    <group ref={group}>
      <line ref={circle}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[circlePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#bfe6ff" transparent toneMapped={false} fog={false} />
      </line>
      <lineSegments ref={chords}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[chordPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d8f2ff" transparent opacity={0} toneMapped={false} fog={false} />
      </lineSegments>
      {items.map((it, i) => (
        <group key={it.name} position={it.pos}>
          <mesh ref={(el) => (gems.current[i] = el)}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial toneMapped={false} fog={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.38, 24, 16]} />
            <meshStandardMaterial color="#cfe6ff" transparent opacity={0.16} roughness={0.1} metalness={0.2} depthWrite={false} />
          </mesh>
          <sprite ref={(el) => (halos.current[i] = el)}>
            <spriteMaterial map={glow} color={it.color} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
          </sprite>
        </group>
      ))}
    </group>
  )
}

// Esprenos de vento: fitas de luz que cortam a cena
function Windspren({ seed }) {
  const ref = useRef()
  const cfg = useMemo(() => {
    const rand = mulberry32(seed)
    return { a: 0.5 + rand() * 0.5, b: 0.8 + rand() * 0.6, r: 5 + rand() * 4, y: rand() * 3, off: rand() * 10 }
  }, [seed])
  const clock = useRef(cfg.off)

  useFrame((_, delta) => {
    clock.current += delta * (0.6 + world.storm * 1.2)
    const t = clock.current
    ref.current.position.set(
      Math.sin(t * cfg.a) * cfg.r,
      cfg.y + Math.sin(t * cfg.b) * 2.2,
      Math.cos(t * cfg.a) * 3 - 1,
    )
  })

  return (
    <Trail width={0.6} length={7} color="#d6f1ff" attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </Trail>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    world.p += (scrollState.progress - world.p) * 0.06
    // a tempestade cresce no meio da página e passa no final
    world.storm = 0.15 + 0.85 * smoothstep(0.05, 0.45, world.p) * (1 - smoothstep(0.72, 0.95, world.p))
    camera.position.x += (pointer.x * 0.3 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.04
  })
  return null
}

export default function StormScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 720
  return (
    <div className="scene">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 17 : 12], fov: 50 }}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#060a12']} />
        <fog attach="fog" args={['#0a1220', 12, 40]} />
        <ambientLight intensity={0.3} color="#8fb0e0" />
        <StormWall />
        <Lightning />
        <Plateaus />
        <Spheres />
        {[1, 2, 3].map((s) => (
          <Windspren key={s} seed={s * 31} />
        ))}
        <Rain count={isMobile ? 500 : 1400} />
        <Rig />
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} luminanceThreshold={0.5} luminanceSmoothing={0.3} />
          <Vignette eskil={false} offset={0.25} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
