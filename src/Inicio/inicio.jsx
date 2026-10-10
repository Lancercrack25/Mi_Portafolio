import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, animate, useReducedMotion } from 'motion/react'
import Starfield from './Starfield'
import ScrambleText from '../components/ScrambleText'
import './inicio.css'

const VELOCIDAD_BASE = 0.08

const Inicio = () => {
  const navigate = useNavigate()
  const reducir = useReducedMotion()
  const [animando, setAnimando] = useState(false)
  const velocidad = useRef(VELOCIDAD_BASE)
  const salto = useRef(null)

  const handleEntrar = () => {
    if (animando) return
    if (reducir) {
      navigate('/home')
      return
    }
    setAnimando(true)
    // Salto de hiperespacio: las estrellas aceleran hasta volverse rayas
    salto.current = animate(VELOCIDAD_BASE, 3, {
      duration: 1.2,
      ease: [0.6, 0, 1, 0.8],
      onUpdate: (v) => {
        velocidad.current = v
      },
      onComplete: () => navigate('/home'),
    })
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'ñ') {
        navigate('/admin')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      salto.current?.stop()
    }
  }, [navigate])

  return (
    <div className="inicio-container">
      <Starfield velocidadRef={velocidad} />

      <motion.div
        className="inicio-cuadro"
        initial={{ opacity: 0, y: 24 }}
        animate={
          animando
            ? { opacity: 0, scale: 0.88, y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: animando ? 0.6 : 0.7, ease: 'easeOut' }}
      >
        <h1>
          <ScrambleText texto="Bienvenido a mi portafolio" retraso={0.5} duracion={1.4} />
        </h1>
        <p>
          <ScrambleText
            modo="escribir"
            texto="Lancercrack25, desarrollador de software"
            retraso={1.7}
            duracion={1.6}
            cursor
          />
        </p>
        <motion.button
          onClick={handleEntrar}
          className="inicio-btn"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          Entrar
        </motion.button>
      </motion.div>

      <motion.div
        className="warp-flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: animando ? 1 : 0 }}
        transition={animando ? { delay: 0.8, duration: 0.4 } : { duration: 0 }}
      />
    </div>
  )
}

export default Inicio
