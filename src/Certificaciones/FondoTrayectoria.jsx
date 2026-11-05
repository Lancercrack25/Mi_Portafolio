import { useCallback, useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import './FondoTrayectoria.css'

// Fondo de la página Trayectoria: transferencia de Hohmann Tierra → Marte.
// Sol en el origen. Órbitas circulares (radio 200 y 304, relación real Tierra/Marte ≈ 1.52)
// y la elipse de transferencia, que toca ambas órbitas. Todo es SVG: sin canvas ni bucles de JS.
const R1 = 200
const R2 = 304
const A = (R1 + R2) / 2
const B = Math.sqrt(R1 * R2)
const TRANSFERENCIA = `M ${R1} 0 A ${A} ${B} 0 0 1 ${-R2} 0`

const FondoTrayectoria = () => {
  const reducir = useReducedMotion()
  const ruta = useRef(null)
  const nave = useRef(null)
  const lectura = useRef(null)
  const { scrollYProgress } = useScroll()

  // La nave avanza por la órbita de transferencia según el scroll de la página:
  // arriba = Tierra, al final = Marte. Se mueve por atributos, sin re-renderizar React.
  const colocar = useCallback((p) => {
    const camino = ruta.current
    if (!camino || !nave.current) return
    const total = camino.getTotalLength()
    const l = Math.min(Math.max(p, 0), 1) * total
    const a = camino.getPointAtLength(l)
    const b = camino.getPointAtLength(Math.min(total, l + 1))
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    nave.current.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${ang})`)
    nave.current.parentNode.style.setProperty('--p', p)
    if (lectura.current) lectura.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', colocar)
  useEffect(() => {
    colocar(scrollYProgress.get())
  }, [colocar, scrollYProgress])

  return (
    <div className="tr-fondo" aria-hidden="true">
      <svg viewBox="-480 -330 960 660" preserveAspectRatio="xMidYMid slice" className="tr-fondo-svg">
        <defs>
          <radialGradient id="tr-sol">
            <stop offset="0" stopColor="#ffd9a0" />
            <stop offset="0.35" stopColor="#ff9d4d" />
            <stop offset="1" stopColor="#ff7a45" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tr-estela" x1="0" x2="1">
            <stop offset="0" stopColor="#2ee7ff" stopOpacity="0" />
            <stop offset="1" stopColor="#2ee7ff" />
          </linearGradient>
        </defs>

        {/* Escala de grados en el borde exterior */}
        <circle r="372" className="tr-escala" />
        <circle r="360" className="tr-escala-fina" />

        {/* Anillos de referencia */}
        {[100, 150, 250, 350].map((r) => (
          <circle key={r} r={r} className="tr-anillo" />
        ))}
        <line x1="-480" x2="480" y1="0" y2="0" className="tr-eje" />
        <line y1="-330" y2="330" x1="0" x2="0" className="tr-eje" />

        {/* Órbitas de la Tierra y de Marte */}
        <circle r={R1} className="tr-orbita tierra" />
        <circle r={R2} className="tr-orbita marte" />

        {/* Órbita de transferencia */}
        <path d={TRANSFERENCIA} className="tr-transferencia" ref={ruta} />
        {/* Tramo ya recorrido: crece con el scroll (pathLength=1 → dashoffset = 1 - avance) */}
        <path
          d={TRANSFERENCIA}
          className="tr-estela"
          pathLength="1"
          strokeDasharray="1"
          style={{ strokeDashoffset: 'calc(1 - var(--p, 0))' }}
        />

        {/* Sol */}
        <circle r="46" fill="url(#tr-sol)" opacity="0.55" />
        <circle r="7" fill="#ffb45e" />

        {/* Puntos de salida y llegada */}
        <circle cx={R1} cy="0" r="4" className="tr-nodo" />
        <circle cx={-R2} cy="0" r="4" className="tr-nodo" />

        {/* Planetas orbitando (giro lento, solo si no hay "reducir movimiento") */}
        <g>
          {!reducir && <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="70s" repeatCount="indefinite" />}
          <circle cx={R1} cy="0" r="6" fill="#2ee7ff" />
          <circle cx={R1} cy="0" r="11" fill="none" stroke="#2ee7ff" strokeOpacity="0.35" />
        </g>
        <g>
          {!reducir && <animateTransform attributeName="transform" type="rotate" from="180 0 0" to="540 0 0" dur="130s" repeatCount="indefinite" />}
          <circle cx={R2} cy="0" r="5" fill="#ff7a45" />
          <circle cx={R2} cy="0" r="10" fill="none" stroke="#ff7a45" strokeOpacity="0.4" />
        </g>
        {/* Nave: su posición la fija el scroll */}
        <g ref={nave}>
          <polygon points="9,0 -6,-5 -3,0 -6,5" className="tr-nave" />
        </g>
      </svg>
      <div className="tr-fondo-velo" />
      <p className="tr-lectura">
        TIERRA <span aria-hidden="true">▸</span> MARTE <b ref={lectura}>000%</b>
      </p>
    </div>
  )
}

export default FondoTrayectoria
