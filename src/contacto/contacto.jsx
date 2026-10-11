import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion } from 'motion/react'
import Footer from '../Footer/Footer'
import Starfield from '../Inicio/Starfield'
import ScrambleText from '../components/ScrambleText'
import useContactoForm from '../Hooks/useContactoForm.js'
import PanelEstado from './PanelEstado'
import Transmision from './Transmision'
import './contacto.css'

const VEL_BASE = 0.08 // estrellas en calma
const VEL_ENVIO = 0.6 // estrellas aceleran mientras se envía
const MIN_TRANSMISION = 1700 // ms mínimos para que el registro alcance a leerse
const MAX_MENSAJE = 1000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validar = (form) => {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'Escribe tu nombre.'
  if (!form.email.trim()) {
    errores.email = 'Escribe tu correo.'
  } else if (!EMAIL_REGEX.test(form.email)) {
    errores.email = 'Ese correo no parece válido. Usa el formato nombre@dominio.com.'
  }
  if (!form.mensaje.trim()) errores.mensaje = 'Cuéntame en qué te puedo ayudar.'
  return errores
}

const Campo = ({ id, etiqueta, error, extra, children }) => (
  <div className="campo" data-error={error ? '' : undefined}>
    <label htmlFor={id}>{etiqueta}</label>
    {children}
    {error && (
      <p className="campo-error" id={`${id}-error`} role="alert">{error}</p>
    )}
    {extra}
  </div>
)

const Contacto = () => {
  const { form, handleChange, resetForm, enviarMensaje } = useContactoForm()
  const [fase, setFase] = useState('form') // form | enviando | ok | error
  const [errores, setErrores] = useState({})

  // Velocidad del campo de estrellas: sube mientras se envía y baja al terminar
  const velocidad = useRef(VEL_BASE)
  const anim = useRef(null)

  const cambiarVelocidad = (hasta, duracion) => {
    anim.current?.stop()
    anim.current = animate(velocidad.current, hasta, {
      duration: duracion,
      ease: 'easeInOut',
      onUpdate: (v) => {
        velocidad.current = v
      },
    })
  }

  useEffect(() => () => anim.current?.stop(), [])

  const cambiar = (e) => {
    handleChange(e)
    if (errores[e.target.name]) {
      setErrores((previos) => ({ ...previos, [e.target.name]: undefined }))
    }
  }

  const transmitir = async () => {
    setFase('enviando')
    cambiarVelocidad(VEL_ENVIO, 0.8)
    const [exito] = await Promise.all([
      enviarMensaje(),
      new Promise((resolver) => setTimeout(resolver, MIN_TRANSMISION)),
    ])
    cambiarVelocidad(VEL_BASE, 1.4)
    if (exito) {
      resetForm()
      setFase('ok')
    } else {
      setFase('error')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fase !== 'form') return

    const encontrados = validar(form)
    setErrores(encontrados)
    const primero = ['nombre', 'email', 'mensaje'].find((c) => encontrados[c])
    if (primero) {
      document.getElementById(`contacto-${primero}`)?.focus()
      return
    }
    transmitir()
  }

  const volverAlFormulario = () => {
    setFase('form')
    // Espera a que termine la animación de salida antes de devolver el foco
    setTimeout(() => document.getElementById('contacto-nombre')?.focus(), 350)
  }

  const describe = (campo) => (errores[campo] ? `contacto-${campo}-error` : undefined)

  return (
    <div className="contacto-container">
      <div className="contacto-estrellas" aria-hidden="true">
        <Starfield velocidadRef={velocidad} />
      </div>

      <div className="contacto-contenido">
        <header>
          <h2 className="contacto-titulo">
            <ScrambleText texto="Contáctame" retraso={0.3} />
          </h2>
          <p className="contacto-subtitulo">¿Tienes algún proyecto en mente? Escríbeme</p>
        </header>

        <div className="contacto-layout">
          <div className="contacto-cuadro">
            <AnimatePresence mode="wait" initial={false}>
              {fase === 'form' ? (
                <motion.form
                  key="form"
                  className="contacto-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Campo id="contacto-nombre" etiqueta="Nombre" error={errores.nombre}>
                    <input
                      id="contacto-nombre"
                      type="text"
                      name="nombre"
                      autoComplete="name"
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={cambiar}
                      aria-invalid={Boolean(errores.nombre)}
                      aria-describedby={describe('nombre')}
                    />
                  </Campo>

                  <Campo id="contacto-email" etiqueta="Email" error={errores.email}>
                    <input
                      id="contacto-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Tu correo"
                      value={form.email}
                      onChange={cambiar}
                      aria-invalid={Boolean(errores.email)}
                      aria-describedby={describe('email')}
                    />
                  </Campo>

                  <Campo
                    id="contacto-mensaje"
                    etiqueta="Mensaje"
                    error={errores.mensaje}
                    extra={<span className="campo-contador">{form.mensaje.length}/{MAX_MENSAJE}</span>}
                  >
                    <textarea
                      id="contacto-mensaje"
                      rows="5"
                      name="mensaje"
                      maxLength={MAX_MENSAJE}
                      placeholder="Tu mensaje..."
                      value={form.mensaje}
                      onChange={cambiar}
                      aria-invalid={Boolean(errores.mensaje)}
                      aria-describedby={describe('mensaje')}
                    />
                  </Campo>

                  <button type="submit" className="contacto-btn">
                    Enviar mensaje
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="transmision"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Transmision
                    estado={fase}
                    onNuevo={volverAlFormulario}
                    onEditar={volverAlFormulario}
                    onReintentar={transmitir}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PanelEstado />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contacto
