import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  VERT_PLANETA,
  FRAG_PLANETA,
  VERT_ATM,
  FRAG_ATM,
  VERT_ESTRELLAS,
  FRAG_ESTRELLAS,
} from './shadersMarte'

// Dirección de la luz del Sol (fija en el mundo)
const LUZ = new THREE.Vector3(-0.75, 0.35, 0.55).normalize()
const INCLINACION_AXIAL = THREE.MathUtils.degToRad(25.2) // la de Marte
const _inv = new THREE.Matrix4()

// Generador pseudoaleatorio con semilla: el cielo es idéntico en cada carga
const crearRng = (semilla) => {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Aproximación a una campana de Gauss (suma de 4 uniformes)
const gauss = (rng) => (rng() + rng() + rng() + rng() - 2) / 0.577

const PALETA = [
  [1, 1, 1],
  [0.8, 0.9, 1],
  [1, 0.92, 0.8],
  [0.6, 0.9, 1],
  [1, 0.6, 0.8],
]

// Campo de estrellas + una banda densa que hace de Vía Láctea
const construirEstrellas = (movil) => {
  const rng = crearRng(20261016)
  const nCampo = movil ? 900 : 1800
  const nBanda = movil ? 700 : 1500
  const total = nCampo + nBanda
  const pos = new Float32Array(total * 3)
  const col = new Float32Array(total * 3)
  const tam = new Float32Array(total)
  const fase = new Float32Array(total)
  const inclinacionBanda = new THREE.Euler(0.9, 0.2, 0.55)
  const v = new THREE.Vector3()

  for (let i = 0; i < total; i++) {
    const banda = i >= nCampo
    if (!banda) {
      const u = rng() * 2 - 1
      const a = rng() * Math.PI * 2
      const r = Math.sqrt(1 - u * u)
      v.set(r * Math.cos(a), u, r * Math.sin(a))
    } else {
      const a = rng() * Math.PI * 2
      const e = gauss(rng) * 0.13
      v.set(Math.cos(e) * Math.cos(a), Math.sin(e), Math.cos(e) * Math.sin(a)).applyEuler(inclinacionBanda)
    }
    const radio = 70 + rng() * 25
    pos[i * 3] = v.x * radio
    pos[i * 3 + 1] = v.y * radio
    pos[i * 3 + 2] = v.z * radio

    const sorteo = rng()
    const c = PALETA[sorteo < 0.62 ? 0 : sorteo < 0.78 ? 1 : sorteo < 0.9 ? 2 : sorteo < 0.96 ? 3 : 4]
    const brillo = banda ? 0.35 + rng() * 0.45 : 0.55 + rng() * 0.45
    col[i * 3] = c[0] * brillo
    col[i * 3 + 1] = c[1] * brillo
    col[i * 3 + 2] = c[2] * brillo

    tam[i] = banda ? 1 + rng() * 1.3 : rng() < 0.04 ? 4 + rng() * 3 : 1.2 + rng() * 2
    fase[i] = rng()
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(tam, 1))
  g.setAttribute('aFase', new THREE.BufferAttribute(fase, 1))
  return g
}

const Estrellas = ({ movil, reducir }) => {
  const matRef = useRef(null)
  const geometria = useMemo(() => construirEstrellas(movil), [movil])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPR: { value: 1 } }), [])
  const pr = useThree((s) => s.gl.getPixelRatio())

  useEffect(() => () => geometria.dispose(), [geometria])

  useFrame((_, dt) => {
    const u = matRef.current?.uniforms
    if (!u) return
    u.uPR.value = pr
    if (!reducir) u.uTime.value += dt
  })

  return (
    <points geometry={geometria} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT_ESTRELLAS}
        fragmentShader={FRAG_ESTRELLAS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Un asterismo en "W" unido con líneas finas: mezcla de mapa estelar y diagrama de red
const PUNTOS_CONSTELACION = [
  [-1.0, 0.3],
  [-0.5, -0.35],
  [0.0, 0.25],
  [0.55, -0.4],
  [1.05, 0.2],
]

const Constelacion = () => {
  const { lineas, nodos } = useMemo(() => {
    const esc = 7
    const p = PUNTOS_CONSTELACION.map(([x, y]) => new THREE.Vector3(x * esc, y * esc, 0))
    const segmentos = []
    for (let i = 0; i < p.length - 1; i++) segmentos.push(p[i], p[i + 1])
    return {
      lineas: new THREE.BufferGeometry().setFromPoints(segmentos),
      nodos: new THREE.BufferGeometry().setFromPoints(p),
    }
  }, [])

  useEffect(
    () => () => {
      lineas.dispose()
      nodos.dispose()
    },
    [lineas, nodos]
  )

  return (
    <group position={[24, 15, -60]}>
      <lineSegments geometry={lineas}>
        <lineBasicMaterial color="#2ee7ff" transparent opacity={0.3} />
      </lineSegments>
      <points geometry={nodos}>
        <pointsMaterial color="#9ff3ff" size={5} sizeAttenuation={false} transparent opacity={0.95} />
      </points>
    </group>
  )
}

const Planeta = ({ reducir }) => {
  const mallaRef = useRef(null)
  const matPlanetaRef = useRef(null)
  const matAtmRef = useRef(null)
  const geometria = useMemo(() => new THREE.SphereGeometry(1, 128, 96), [])
  const geomAtm = useMemo(() => new THREE.SphereGeometry(1.14, 64, 48), [])
  const uPlaneta = useMemo(() => ({ uLight: { value: new THREE.Vector3() } }), [])
  const uAtm = useMemo(
    () => ({
      uLightView: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(0.22, 0.72, 1.0) },
    }),
    []
  )

  useEffect(
    () => () => {
      geometria.dispose()
      geomAtm.dispose()
    },
    [geometria, geomAtm]
  )

  useFrame((state, dt) => {
    const malla = mallaRef.current
    if (!malla) return
    if (!reducir) malla.rotation.y += dt * 0.045
    malla.updateWorldMatrix(true, false)
    // La luz se pasa al espacio del objeto para sombrear el terreno que gira
    const up = matPlanetaRef.current?.uniforms
    if (up) up.uLight.value.copy(LUZ).transformDirection(_inv.copy(malla.matrixWorld).invert())
    const ua = matAtmRef.current?.uniforms
    if (ua) ua.uLightView.value.copy(LUZ).transformDirection(state.camera.matrixWorldInverse)
  })

  return (
    <group rotation={[0, 0, INCLINACION_AXIAL]}>
      <mesh ref={mallaRef} geometry={geometria}>
        <shaderMaterial
          ref={matPlanetaRef}
          vertexShader={VERT_PLANETA}
          fragmentShader={FRAG_PLANETA}
          uniforms={uPlaneta}
        />
      </mesh>
      <mesh geometry={geomAtm}>
        <shaderMaterial
          ref={matAtmRef}
          vertexShader={VERT_ATM}
          fragmentShader={FRAG_ATM}
          uniforms={uAtm}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

const RADIO_ORBITA = 1.62

// Órbita punteada con un satélite pequeño (cuerpo + paneles solares)
const Orbita = ({ reducir }) => {
  const satRef = useRef(null)
  const angulo = useRef(0.9)

  const linea = useMemo(() => {
    const pts = []
    for (let i = 0; i < 160; i++) {
      const a = (i / 160) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * RADIO_ORBITA, 0, Math.sin(a) * RADIO_ORBITA))
    }
    const l = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({ color: 0x2ee7ff, transparent: true, opacity: 0.55, dashSize: 0.05, gapSize: 0.04 })
    )
    l.computeLineDistances()
    return l
  }, [])

  useEffect(
    () => () => {
      linea.geometry.dispose()
      linea.material.dispose()
    },
    [linea]
  )

  useFrame((_, dt) => {
    const sat = satRef.current
    if (!sat) return
    if (!reducir) angulo.current += dt * 0.32
    const a = angulo.current
    sat.position.set(Math.cos(a) * RADIO_ORBITA, 0, Math.sin(a) * RADIO_ORBITA)
    sat.rotation.y = -a
  })

  return (
    <group rotation={[1.22, 0, 0.35]}>
      <primitive object={linea} />
      <group ref={satRef}>
        <mesh>
          <boxGeometry args={[0.05, 0.038, 0.038]} />
          <meshBasicMaterial color="#c9fbff" />
        </mesh>
        <mesh position={[0.075, 0, 0]}>
          <boxGeometry args={[0.07, 0.004, 0.034]} />
          <meshBasicMaterial color="#3a7bff" />
        </mesh>
        <mesh position={[-0.075, 0, 0]}>
          <boxGeometry args={[0.07, 0.004, 0.034]} />
          <meshBasicMaterial color="#3a7bff" />
        </mesh>
      </group>
    </group>
  )
}

const Conjunto = ({ progresoRef, reducir }) => {
  const size = useThree((s) => s.size)
  const cieloRef = useRef(null)
  const puntero = useRef({ x: 0, y: 0 })

  const aspecto = size.width / size.height
  const horizontal = aspecto > 1.05
  const movil = size.width < 700
  // En pantallas anchas el planeta va a la derecha (el texto queda a la izquierda)
  const colocacion = horizontal ? { x: 2.5, y: -0.1, escala: 1.9 } : { x: 0, y: -1.5, escala: 1.55 }
  const factorConstelacion = Math.min(1, aspecto / 1.78)

  useEffect(() => {
    const alMover = (e) => {
      puntero.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      puntero.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', alMover)
    return () => window.removeEventListener('pointermove', alMover)
  }, [])

  useFrame((state, dt) => {
    const p = reducir ? 0 : progresoRef.current
    const e = p * p * (3 - 2 * p)
    const k = Math.min(1, dt * 4)

    // La cámara se acerca y se desplaza hacia el planeta al hacer scroll
    const cam = state.camera
    cam.position.z += (8 - 3.1 * e - cam.position.z) * k
    cam.position.x += (colocacion.x * 0.55 * e - cam.position.x) * k

    // Paralaje suave del cielo con el cursor
    const cielo = cieloRef.current
    if (cielo && !reducir) {
      cielo.rotation.y += (-puntero.current.x * 0.05 + e * 0.25 - cielo.rotation.y) * k
      cielo.rotation.x += (puntero.current.y * 0.03 - cielo.rotation.x) * k
    }
  })

  return (
    <>
      <color attach="background" args={['#03040a']} />
      <group ref={cieloRef}>
        <Estrellas movil={movil} reducir={reducir} />
        {horizontal && (
          <group scale={[factorConstelacion, 1, 1]}>
            <Constelacion />
          </group>
        )}
      </group>
      <group position={[colocacion.x, colocacion.y, 0]} scale={colocacion.escala}>
        <Planeta reducir={reducir} />
        <Orbita reducir={reducir} />
      </group>
    </>
  )
}

const EscenaMarte = ({ progresoRef, reducir, activo }) => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 300 }}
    gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    frameloop={activo ? 'always' : 'never'}
    flat
  >
    <Conjunto progresoRef={progresoRef} reducir={reducir} />
  </Canvas>
)

export default EscenaMarte
