import { motion } from 'motion/react'
import Tarjeta from './Tarjeta'

const contenedor = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

// Un bloque con título pequeño y su lista de tarjetas.
const Grupo = ({ titulo, datos, destacadas = false, clase = '' }) => (
  <div className={`tr-grupo ${clase}`}>
    <h3 className="tr-grupo-titulo">{titulo}</h3>
    <motion.ul
      className="tr-lista"
      variants={contenedor}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {datos.map((d) => (
        <Tarjeta key={d.id} dato={d} destacada={destacadas} />
      ))}
    </motion.ul>
  </div>
)

export default Grupo
