import { useReducedMotion } from 'motion/react'
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
        <path d={TRANSFERENCIA} className="tr-transferencia" />

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

        {/* Nave recorriendo la transferencia */}
        {!reducir && (
          <g>
            <rect width="7" height="7" x="-3.5" y="-3.5" fill="#fff" className="tr-nave">
              <animateMotion dur="16s" repeatCount="indefinite" path={TRANSFERENCIA} rotate="auto" />
            </rect>
          </g>
        )}
      </svg>
      <div className="tr-fondo-velo" />
    </div>
  )
}

export default FondoTrayectoria
