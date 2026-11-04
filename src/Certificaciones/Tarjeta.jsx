import { motion } from 'motion/react'
import './certificacion.css'

const entra = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Tarjeta común. Todo lo que venga vacío en datos.js simplemente no se dibuja.
const Tarjeta = ({ dato, destacada = false }) => (
  <motion.li className={`tr-tarjeta ${destacada ? 'destacada' : ''}`} variants={entra}>
    <span className="tr-esq tr-esq-a" aria-hidden="true" />
    <span className="tr-esq tr-esq-b" aria-hidden="true" />
    <div className="tr-fila">
      <span className="tr-etiqueta">{dato.etiqueta}</span>
      {dato.anio && <span className="tr-anio">{dato.anio}</span>}
    </div>
    <h3 className="tr-nombre">{dato.titulo}</h3>
    {(dato.emisor || dato.rol) && (
      <p className="tr-emisor">
        {dato.emisor}
        {dato.emisor && dato.rol && ' · '}
        {dato.rol}
      </p>
    )}
    {dato.detalle && <p className="tr-detalle">{dato.detalle}</p>}
    {dato.enlace && (
      <a className="tr-verificar" href={dato.enlace} target="_blank" rel="noopener noreferrer">
        Verificar ↗
      </a>
    )}
  </motion.li>
)

export default Tarjeta
