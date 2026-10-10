import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import './ScrambleText.css'

const RUIDO = '!<>-_\\/[]{}=+*^?#%&$01'

// Para lectores de pantalla: el texto real siempre está disponible
const SOLO_LECTOR = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
}

// Deja las primeras `fijas` letras tal cual y el resto como caracteres al azar.
// Conserva los espacios y el largo total, así el texto no mueve el diseño.
const conRuido = (texto, fijas) => {
  let s = texto.slice(0, fijas)
  for (let i = fijas; i < texto.length; i++) {
    s += texto[i] === ' ' ? ' ' : RUIDO[Math.floor(Math.random() * RUIDO.length)]
  }
  return s
}

/**
 * Texto con efecto de terminal.
 *  modo="decodificar": empieza como ruido y se va fijando letra por letra.
 *  modo="escribir":    se escribe de izquierda a derecha (reserva el espacio).
 *  cursor:             bloque parpadeante al final.
 *  alHover:            vuelve a decodificarse al pasar el cursor.
 */
const ScrambleText = ({
  texto,
  retraso = 0,
  duracion = 1.2,
  modo = 'escribir',
  cursor = false,
  alHover = false,
}) => {
  const reducir = useReducedMotion()
  const [fijas, setFijas] = useState(reducir ? texto.length : 0)
  const [mostrado, setMostrado] = useState(texto)
  const [activo, setActivo] = useState(Boolean(reducir))
  const controles = useRef(null)
  const ultimo = useRef(0)

  const correr = useCallback(
    (espera, dur) => {
      controles.current?.stop()
      controles.current = animate(0, texto.length, {
        duration: dur,
        delay: espera,
        ease: 'linear',
        onUpdate: (p) => {
          const n = Math.floor(p)
          setActivo(true)
          setFijas(n)
          // El ruido cambia ~22 veces por segundo, no en cada frame
          const ahora = performance.now()
          if (ahora - ultimo.current > 45) {
            ultimo.current = ahora
            setMostrado(conRuido(texto, n))
          }
        },
        onComplete: () => {
          setFijas(texto.length)
          setMostrado(texto)
        },
      })
    },
    [texto]
  )

  useEffect(() => {
    if (reducir) return
    correr(retraso, duracion)
    return () => controles.current?.stop()
  }, [correr, reducir, retraso, duracion])

  return (
    <span onPointerEnter={alHover && !reducir ? () => correr(0, 0.6) : undefined}>
      <span style={SOLO_LECTOR}>{texto}</span>
      <span aria-hidden="true" style={{ visibility: activo ? 'visible' : 'hidden' }}>
        {modo === 'escribir' ? (
          <>
            {texto.slice(0, fijas)}
            <span style={{ visibility: 'hidden' }}>{texto.slice(fijas)}</span>
          </>
        ) : (
          mostrado
        )}
      </span>
      {cursor && activo && <span className="cursor-bloque" aria-hidden="true" />}
    </span>
  )
}

export default ScrambleText
