import { motion } from 'motion/react'

const COLUMNAS = 12
const FILAS = 8
const ACENTOS = ['#04ebf3', '#7f0bdd', '#c72318']

// Se calcula una sola vez: cada bloque tiene su retraso (onda diagonal + un poco de azar)
// y algunos llevan un color de acento para que el mosaico no se vea plano.
const BLOQUES = Array.from({ length: COLUMNAS * FILAS }, (_, i) => {
  const col = i % COLUMNAS
  const fila = Math.floor(i / COLUMNAS)
  return {
    id: i,
    espera: (col + fila * 0.6) * 0.02 + Math.random() * 0.06,
    color: Math.random() < 0.12 ? ACENTOS[Math.floor(Math.random() * ACENTOS.length)] : null,
  }
})

const variantes = {
  cubierto: (b) => ({ opacity: 1, scale: 1, transition: { duration: 0.16, delay: b.espera } }),
  libre: (b) => ({ opacity: 0, scale: 0.35, transition: { duration: 0.2, delay: b.espera } }),
}

// Mosaico de pixeles. Nace cubriendo la pantalla ("cubierto"), se deshace al entrar
// ("libre") y vuelve a cubrir al salir. Como es el mismo estado al salir y al entrar,
// el cambio de página ocurre justo cuando todo está tapado.
const PixelCurtain = () => (
  <motion.div
    className="curtain"
    initial="cubierto"
    animate="libre"
    exit="cubierto"
    aria-hidden="true"
  >
    {BLOQUES.map((b) => (
      <motion.span
        key={b.id}
        className="curtain-bloque"
        custom={b}
        variants={variantes}
        style={b.color ? { background: b.color } : undefined}
      />
    ))}
  </motion.div>
)

export default PixelCurtain
