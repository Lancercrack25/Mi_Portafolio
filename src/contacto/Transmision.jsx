import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

// Cada línea del registro aparece con un pequeño retraso. Todas las líneas describen
// algo que de verdad pasó (se validaron los datos, se hizo la petición, llegó o no la respuesta).
const Linea = ({ children, retraso = 0, tono }) => (
  <motion.p
    className={`tx-linea ${tono ? `tx-${tono}` : ''}`}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: retraso, duration: 0.25 }}
  >
    <span className="tx-prompt" aria-hidden="true">&gt;</span>
    {children}
  </motion.p>
)

const TITULOS = {
  enviando: 'Enviando tu mensaje',
  ok: 'Mensaje enviado',
  error: 'No se pudo enviar',
}

const Transmision = ({ estado, onNuevo, onReintentar, onEditar }) => {
  const raiz = useRef(null)

  // Al reemplazar el formulario, el foco pasa a este bloque para que
  // los lectores de pantalla anuncien lo que ocurre
  useEffect(() => {
    raiz.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="tx" ref={raiz} tabIndex={-1} role="status" aria-live="polite">
      <h3 className="tx-titulo">{TITULOS[estado]}</h3>

      <div className="tx-consola">
        <Linea>Preparando paquete…</Linea>
        <Linea retraso={0.45}>Datos validados <span className="tx-ok">✓</span></Linea>
        <Linea retraso={0.9}>Abriendo enlace con el servidor…</Linea>

        {estado === 'ok' && (
          <>
            <Linea tono="ok">Señal recibida ✓</Linea>
            <Linea retraso={0.35} tono="suave">Mensaje entregado. Te responderé pronto.</Linea>
          </>
        )}

        {estado === 'error' && (
          <>
            <Linea tono="error">Sin señal ✗</Linea>
            <Linea retraso={0.35} tono="suave">
              El servidor no respondió como se esperaba. Tu mensaje sigue en el formulario.
            </Linea>
          </>
        )}
      </div>

      <div className="senal" data-estado={estado} aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>

      {estado === 'ok' && (
        <div className="tx-acciones">
          <button type="button" className="contacto-btn" onClick={onNuevo}>Enviar otro mensaje</button>
        </div>
      )}

      {estado === 'error' && (
        <div className="tx-acciones">
          <button type="button" className="contacto-btn" onClick={onReintentar}>Reintentar</button>
          <button type="button" className="contacto-btn secundario" onClick={onEditar}>Editar mensaje</button>
        </div>
      )}
    </div>
  )
}

export default Transmision
