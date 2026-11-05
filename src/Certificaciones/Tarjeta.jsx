import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import './certificacion.css'

const entra = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Imagen ampliada. Va en un portal (body) porque la tarjeta tiene transform y rompería el position: fixed.
const Visor = ({ src, alt, cerrar }) => {
  const boton = useRef(null)
  useEffect(() => {
    const previo = document.activeElement
    const tecla = (e) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', tecla)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    boton.current?.focus()
    return () => {
      window.removeEventListener('keydown', tecla)
      document.body.style.overflow = overflow
      previo?.focus?.()
    }
  }, [cerrar])

  return createPortal(
    <div className="tr-visor" role="dialog" aria-modal="true" aria-label={alt} onClick={cerrar}>
      <button type="button" className="tr-visor-cerrar" onClick={cerrar} ref={boton} aria-label="Cerrar imagen">
        ✕
      </button>
      <img src={src} alt={alt} className="tr-visor-img" onClick={(e) => e.stopPropagation()} />
    </div>,
    document.body
  )
}

// Tarjeta común. Todo lo que venga vacío en datos.js simplemente no se dibuja.
const Tarjeta = ({ dato, destacada = false }) => {
  const [abierta, setAbierta] = useState(false)
  return (
  <motion.li className={`tr-tarjeta ${destacada ? 'destacada' : ''}`} variants={entra}>
    <span className="tr-esq tr-esq-a" aria-hidden="true" />
    <span className="tr-esq tr-esq-b" aria-hidden="true" />
    <div className="tr-cuerpo">
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
    </div>
    {dato.imagen && (
      <>
        <button type="button" className="tr-miniatura" onClick={() => setAbierta(true)} aria-label={`Ver documento: ${dato.titulo}`}>
          <img src={dato.imagen} alt="" loading="lazy" />
          <span>Ver documento</span>
        </button>
        {abierta && <Visor src={dato.imagen} alt={`Documento: ${dato.titulo}`} cerrar={() => setAbierta(false)} />}
      </>
    )}
    {dato.enlace && (
      <a className="tr-verificar" href={dato.enlace} target="_blank" rel="noopener noreferrer">
        Verificar ↗
      </a>
    )}
  </motion.li>
  )
}

export default Tarjeta
