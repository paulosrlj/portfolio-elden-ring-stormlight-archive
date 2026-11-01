import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { scrollState } from '../scroll'
import { mulberry32, makeGlowTexture } from './three-utils'

const GOLD = new THREE.Color('#f0c35a')

function buildTree() {
  const rand = mulberry32(1337)
  const parts = []
  const tips = []
  const up = new THREE.Vector3(0, 1, 0)

  const segment = (start, end, r0, r1) => {
    const dir = end.clone().sub(start)
    const len = dir.length()
    const geo = new THREE.CylinderGeometry(r1, r0, len, 7, 1, true)
    geo.translate(0, len / 2, 0)
    geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir.normalize()))
    geo.translate(start.x, start.y, start.z)
    parts.push(geo)
  }

  const branch = (start, dir, len, radius, depth) => {
    // leve curvatura: dois sub-segmentos
    const mid = start.clone().add(dir.clone().multiplyScalar(len * 0.5))
    mid.x += (rand() - 0.5) * len * 0.15
    mid.z += (rand() - 0.5) * len * 0.15
    const end = start.clone().add(dir.clone().multiplyScalar(len))
    segment(start, mid, radius, radius * 0.85)
    segment(mid, end, radius * 0.85, radius * 0.7)

    if (depth === 0) {
      tips.push(end)
      return
    }
    const children = depth > 5 ? 2 : 3
    for (let i = 0; i < children; i++) {
      const spread = depth > 4 ? 0.7 : 1.05
      const d = dir
        .clone()
        .add(new THREE.Vector3((rand() - 0.5) * 2 * spread, rand() * 0.5, (rand() - 0.5) * 2 * spread))
        .normalize()
      // abre a copa para fora e um pouco para baixo nas pontas
      if (depth < 3) d.y -= 0.25
      d.normalize()
      branch(end, d, len * (0.7 + rand() * 0.12), radius * 0.68, depth - 1)
    }
  }

  // tronco
  branch(new THREE.Vector3(0, -0.5, 0), up.clone(), 3.2, 0.42, 7)

  // raízes
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + rand() * 0.4
    const d = new THREE.Vector3(Math.cos(a), -0.35, Math.sin(a)).normalize()
    const start = new THREE.Vector3(0, 0.2, 0)
    const end = start.clone().add(d.multiplyScalar(2 + rand() * 1.5))
    segment(start, end, 0.28, 0.04)
  }

  return { geometry: mergeGeometries(parts), tips }
}


function ErdTree() {
  const { geometry, tips } = useMemo(buildTree, [])
  const glow = useMemo(makeGlowTexture, [])
  const group = useRef()
  const mat = useRef()

  // folhas: nuvem de pontos ao redor das pontas dos galhos
  const leaves = useMemo(() => {
    const rand = mulberry32(42)
    const pts = []
    tips.forEach((t) => {
      for (let i = 0; i < 9; i++) {
        pts.push(t.x + (rand() - 0.5) * 1.6, t.y + (rand() - 0.5) * 1.2, t.z + (rand() - 0.5) * 1.6)
      }
    })
    return new Float32Array(pts)
  }, [tips])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.03
    mat.current.emissiveIntensity = 1.6 + Math.sin(t * 1.3) * 0.25
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={mat}
          color="#c9952f"
          emissive={GOLD}
          emissiveIntensity={1.6}
          roughness={0.4}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[leaves, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glow}
          size={0.32}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffd27a"
          toneMapped={false}
        />
      </points>
    </group>
  )
}

// folhas douradas / brasas caindo
function FallingEmbers({ count = 700 }) {
  const glow = useMemo(makeGlowTexture, [])
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const rand = mulberry32(7)
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 30
      positions[i * 3 + 1] = rand() * 22 - 2
      positions[i * 3 + 2] = (rand() - 0.5) * 30
      speeds[i] = 0.25 + rand() * 0.6
    }
    return { positions, speeds }
  }, [count])

  useFrame(({ clock }, delta) => {
    const arr = ref.current.geometry.attributes.position.array
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3 + 1] -= speeds[i] * delta
      arr[i3] += Math.sin(t * 0.6 + i) * 0.004
      arr[i3 + 2] += Math.cos(t * 0.5 + i * 0.7) * 0.004
      if (arr[i3 + 1] < -2) arr[i3 + 1] = 20
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={glow}
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#ffbf55"
        toneMapped={false}
      />
    </points>
  )
}

// círculo rúnico girando na base da árvore
function RuneCircle() {
  const ref = useRef()
  const ticks = useMemo(() => {
    const pts = []
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2
      const r0 = i % 4 === 0 ? 4.3 : 4.55
      pts.push(Math.cos(a) * r0, 0, Math.sin(a) * r0, Math.cos(a) * 4.8, 0, Math.sin(a) * 4.8)
    }
    return new Float32Array(pts)
  }, [])
  useFrame((_, d) => (ref.current.rotation.y += d * 0.08))

  const lineMat = (
    <lineBasicMaterial color="#e2b553" transparent opacity={0.55} toneMapped={false} />
  )
  return (
    <group ref={ref} position={[0, -0.45, 0]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[4.8, 4.86, 128]} />
        <meshBasicMaterial color="#f0c35a" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[5.6, 5.63, 128]} />
        <meshBasicMaterial color="#f0c35a" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ticks, 3]} />
        </bufferGeometry>
        {lineMat}
      </lineSegments>
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]}>
      <circleGeometry args={[60, 64]} />
      <meshStandardMaterial color="#120e09" roughness={1} />
    </mesh>
  )
}

// pilares em ruínas no horizonte
function Ruins() {
  const items = useMemo(() => {
    const rand = mulberry32(99)
    return Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2 + rand() * 0.3
      const r = 16 + rand() * 8
      return {
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        h: 1.5 + rand() * 4,
        w: 0.4 + rand() * 0.6,
      }
    })
  }, [])
  return items.map((it, i) => (
    <mesh key={i} position={[it.pos[0], it.h / 2 - 0.5, it.pos[2]]}>
      <boxGeometry args={[it.w, it.h, it.w]} />
      <meshStandardMaterial color="#1b1610" roughness={1} />
    </mesh>
  ))
}

// câmera guiada pelo scroll + parallax do mouse
function CameraRig() {
  const { camera, pointer } = useThree()
  const look = useRef(new THREE.Vector3(0, 5, 0))
  useFrame(() => {
    const p = scrollState.progress
    const angle = -0.35 + p * Math.PI * 0.9
    const radius = 15 - Math.sin(p * Math.PI) * 4
    const height = 3 + p * 6
    const target = new THREE.Vector3(
      Math.sin(angle) * radius + pointer.x * 1.2,
      height + pointer.y * 0.8,
      Math.cos(angle) * radius,
    )
    camera.position.lerp(target, 0.05)
    look.current.lerp(new THREE.Vector3(0, 5 + p * 2.5, 0), 0.05)
    camera.lookAt(look.current)
  })
  return null
}

export default function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 720
  return (
    <div className="scene">
      <Canvas
        camera={{ position: [0, 3, 15], fov: 55 }}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0a0807']} />
        <fog attach="fog" args={['#0a0807', 10, 38]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 9, 0]} intensity={60} color="#ffcf70" distance={30} />
        <directionalLight position={[-8, 6, -10]} intensity={0.4} color="#6b5a8a" />

        <ErdTree />
        <FallingEmbers count={isMobile ? 350 : 700} />
        <RuneCircle />
        <Ground />
        <Ruins />
        <Stars radius={60} depth={30} count={1500} factor={3} saturation={0} fade speed={0.4} />
        <CameraRig />

        <EffectComposer>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.3} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
