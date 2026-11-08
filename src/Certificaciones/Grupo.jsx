import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import Tarjeta from './Tarjeta'
// Un bloque con título pequeño (con línea que se dibuja) y su lista de tarjetas.
// linea: dibuja una línea de progreso que se va encendiendo con el scroll (línea de tiempo).
const Grupo = ({ titulo, datos, destacadas = false, clase = '', linea = false }) => {
  const lista = useRef(null)
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 70%', 'end 70%'] })

  return (
    <div className={`tr-grupo ${clase}`}>
      <h3 className="tr-grupo-titulo">
        <span>{titulo}</span>
        <motion.span
          className="tr-grupo-linea"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </h3>
      <ul className="tr-lista" ref={lista}>
        {linea && <motion.span className="tr-linea-progreso" aria-hidden="true" style={{ scaleY: scrollYProgress }} />}
        {datos.map((d, i) => (
          <Tarjeta key={d.id} dato={d} indice={i} destacada={destacadas} />
        ))}
      </ul>
    </div>
  )
}
export default Grupo