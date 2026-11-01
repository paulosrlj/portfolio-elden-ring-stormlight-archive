import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { scrollState } from '../../shared/scroll'
import { mulberry32, makeGlowTexture } from '../../shared/three-utils'

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Progresso do scroll suavizado, compartilhado pelos componentes da cena
const smooth = { p: 0 }

// O emblema é composto de traços (círculos, arcos e linhas) quebrados em fragmentos
function buildShards() {
  const rand = mulberry32(2024)
  const strokes = []
  const circle = (cx, cy, r, n, thick, a0 = 0, a1 = Math.PI * 2) => {
    const pts = []
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
    strokes.push({ pts, thick })
  }
  const line = (x0, y0, x1, y1, n, thick) => {
    const pts = []
    for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n])
    strokes.push({ pts, thick })
  }

  circle(0, 0, 3.8, 120, 0.11) // anel externo
  circle(0, 1.05, 1.45, 56, 0.07) // anel superior
  circle(-0.95, -0.75, 1.9, 70, 0.065) // anéis entrelaçados
  circle(0.95, -0.75, 1.9, 70, 0.065)
  circle(0, -0.4, 3.05, 60, 0.05, Math.PI * 1.12, Math.PI * 1.88) // arco inferior
  line(0, -4.6, 0, 4.6, 46, 0.075) // eixo vertical
  line(-1.5, -2.45, 1.5, -2.45, 14, 0.05) // traço horizontal

  const shards = []
  strokes.forEach(({ pts, thick }) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[i + 1]
      const x = (x0 + x1) / 2
      const y = (y0 + y1) / 2
      const len = Math.hypot(x1 - x0, y1 - y0)
      // a iluminação percorre o anel a partir do topo, no sentido horário
      const around = ((Math.PI / 2 - Math.atan2(y, x) + Math.PI * 4) % (Math.PI * 2)) / (Math.PI * 2)
      const outward = new THREE.Vector3(x, y, 0).normalize()
      shards.push({
        x, y,
        rot: Math.atan2(y1 - y0, x1 - x0),
        len: len * (0.78 + rand() * 0.14), // pequenas falhas entre fragmentos
        thick,
        threshold: around * 0.75 + rand() * 0.1,
        dir: new THREE.Vector3(
          outward.x + (rand() - 0.5) * 0.8,
          outward.y + (rand() - 0.5) * 0.8,
          (rand() - 0.5) * 2.4,
        ),
        dist: 1.2 + rand() * 4.5,
        spin: new THREE.Vector3((rand() - 0.5) * 6, (rand() - 0.5) * 6, (rand() - 0.5) * 4),
        phase: rand() * Math.PI * 2,
      })
    }
  })
  return shards
}

const GOLD_DIM = new THREE.Color('#7a5a22')
const GOLD_LIT = new THREE.Color('#ffd27a')

function Ring() {
  const shards = useMemo(buildShards, [])
  const mesh = useRef()
  const group = useRef()
  const halo = useRef()
  const glow = useMemo(makeGlowTexture, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const { pointer } = useThree()

  useLayoutEffect(() => {
    // garante que instanceColor exista antes do primeiro frame
    mesh.current.setColorAt(0, GOLD_DIM)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = smooth.p
    // intacto no início, estilhaçado no meio, recomposto no final
    const shatter = smoothstep(0.1, 0.5, p) * (1 - smoothstep(0.72, 0.96, p))
    const restored = smoothstep(0.85, 1, p)

    shards.forEach((s, i) => {
      const k = shatter * s.dist
      dummy.position.set(
        s.x + s.dir.x * k + Math.sin(t * 0.7 + s.phase) * 0.15 * shatter,
        s.y + s.dir.y * k + Math.cos(t * 0.6 + s.phase) * 0.15 * shatter,
        s.dir.z * k,
      )
      dummy.rotation.set(s.spin.x * shatter, s.spin.y * shatter, s.rot + s.spin.z * shatter)
      dummy.scale.set(s.len, s.thick, s.thick)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)

      // cada fragmento acende quando o scroll passa do seu limiar
      const lit = Math.max(smoothstep(s.threshold, s.threshold + 0.08, p * 1.05), restored)
      const flicker = 1 + Math.sin(t * 2 + s.phase) * 0.12
      color.copy(GOLD_DIM).lerp(GOLD_LIT, lit).multiplyScalar((0.6 + lit * 2.4 + restored * 0.8) * flicker)
      mesh.current.setColorAt(i, color)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true

    // inteiro, o anel fica de frente e alinhado; só balança enquanto está despedaçado
    const sway = 0.02 + shatter * 0.2
    group.current.rotation.set(-pointer.y * sway, Math.sin(t * 0.25) * sway + pointer.x * sway, 0)
    group.current.position.y = Math.sin(t * 0.5) * 0.06
    const haloScale = 9 + p * 4 + restored * 4 + Math.sin(t * 1.2) * 0.3
    halo.current.scale.set(haloScale, haloScale, 1)
    halo.current.material.opacity = 0.18 + p * 0.25 + restored * 0.35
  })

  return (
    <group ref={group}>
      <sprite ref={halo} position={[0, 0, -1.5]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
      </sprite>
      <instancedMesh ref={mesh} args={[undefined, undefined, shards.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} fog={false} />
      </instancedMesh>
    </group>
  )
}

// Silhueta de montanhas para as camadas de parallax
function ridgeGeometry(seed, width, height, peaks) {
  const rand = mulberry32(seed)
  const shape = new THREE.Shape()
  shape.moveTo(-width / 2, -20)
  const steps = peaks * 6
  for (let i = 0; i <= steps; i++) {
    const x = -width / 2 + (width * i) / steps
    const y =
      Math.sin(i * 0.45 + seed) * height * 0.35 +
      Math.sin(i * 1.3 + seed * 2) * height * 0.2 +
      rand() * height * 0.25
    shape.lineTo(x, y)
  }
  shape.lineTo(width / 2, -20)
  return new THREE.ShapeGeometry(shape)
}

// camadas mais próximas se movem mais rápido: sensação de subir em direção ao anel
const LAYERS = [
  { seed: 3, z: -24, y: -3.2, color: '#2a1f14', height: 4.5, speed: 3, mouse: 0.4 },
  { seed: 7, z: -14, y: -4.6, color: '#1a130c', height: 3.5, speed: 6, mouse: 0.9 },
  { seed: 11, z: -6, y: -5.6, color: '#0e0a06', height: 2.6, speed: 10, mouse: 1.6 },
]

function ParallaxLayers() {
  const refs = useRef([])
  const { pointer } = useThree()
  const geos = useMemo(() => LAYERS.map((l) => ridgeGeometry(l.seed, 120, l.height, 22)), [])

  useFrame(() => {
    LAYERS.forEach((l, i) => {
      const m = refs.current[i]
      m.position.y = l.y - smooth.p * l.speed
      m.position.x = -pointer.x * l.mouse
    })
  })

  return LAYERS.map((l, i) => (
    <mesh key={l.seed} ref={(el) => (refs.current[i] = el)} geometry={geos[i]} position={[0, l.y, l.z]}>
      <meshBasicMaterial color={l.color} />
    </mesh>
  ))
}

// poeira dourada em três profundidades, também com parallax
function Motes({ count, depth, speed, size }) {
  const glow = useMemo(makeGlowTexture, [])
  const ref = useRef()
  const { pointer } = useThree()
  const positions = useMemo(() => {
    const rand = mulberry32(depth * 100 + count)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 40
      arr[i * 3 + 1] = (rand() - 0.5) * 30
      arr[i * 3 + 2] = depth + (rand() - 0.5) * 4
    }
    return arr
  }, [count, depth])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // duas cópias empilhadas permitem repetir a poeira sem emendas
    ref.current.position.y = (smooth.p * speed + t * 0.08 * speed) % 30
    ref.current.position.x = -pointer.x * speed * 0.15
  })

  return (
    <group ref={ref}>
      {[0, -30].map((offset) => (
        <points key={offset} position={[0, offset, 0]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={glow}
            size={size}
            sizeAttenuation
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#ffc35e"
            toneMapped={false}
          />
        </points>
      ))}
    </group>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    smooth.p += (scrollState.progress - smooth.p) * 0.06
    // a câmera desliza sem girar, então o anel nunca aparece em perspectiva torta
    camera.position.x += (pointer.x * 0.3 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.04
  })
  return null
}

export default function RingScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 720
  return (
    <div className="scene">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 16 : 12], fov: 50 }}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0a0807']} />
        <fog attach="fog" args={['#0a0807', 14, 42]} />
        <Stars radius={70} depth={30} count={1800} factor={3} saturation={0} fade speed={0.3} />
        <ParallaxLayers />
        <Motes count={isMobile ? 120 : 260} depth={-16} speed={2} size={0.12} />
        <Motes count={isMobile ? 80 : 160} depth={-4} speed={5} size={0.16} />
        <Ring />
        <Motes count={isMobile ? 30 : 60} depth={6} speed={10} size={0.12} />
        <Rig />
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.25} luminanceThreshold={0.5} luminanceSmoothing={0.3} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
