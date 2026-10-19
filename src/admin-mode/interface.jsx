import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useMensajes from '../Hooks/useMensajes'
import { INACTIVIDAD_MS, cerrarSesion, estaAutenticado, msRestantes, registrarActividad } from './auth'
import './interface.css'

const swalConfig = {
  background: 'linear-gradient(to right, #0d1a64, #24163e)',
  color: '#fff',
  confirmButtonColor: '#646cff',
}

const DIA = 86400000
const lista = { oculto: {}, visible: { transition: { staggerChildren: 0.09 } } }
const entra = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }
const fechaCorta = (f) => new Date(f).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
const hora = (f) => new Date(f).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
const mmss = (ms) => {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// Número que sube de 0 al valor real
const Contador = ({ valor }) => {
  const reducir = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reducir) return
    const c = animate(0, valor, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [valor, reducir])
  return <>{reducir ? valor : n}</>
}

const DIAS_GRAFICA = 30
const inicioDia = (t) => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// Barras con los mensajes reales de los últimos 30 días
const Grafica = ({ mensajes, momento }) => {
  const dias = useMemo(() => {
    const hoy = inicioDia(momento)
    const lista = Array.from({ length: DIAS_GRAFICA }, (_, i) => ({ t: hoy - (DIAS_GRAFICA - 1 - i) * DIA, n: 0 }))
    mensajes.forEach((m) => {
      const t = new Date(m.fecha).getTime()
      if (Number.isNaN(t)) return
      const i = Math.round((inicioDia(t) - lista[0].t) / DIA)
      if (i >= 0 && i < DIAS_GRAFICA) lista[i].n += 1
    })
    return lista
  }, [mensajes, momento])
  const max = Math.max(1, ...dias.map((d) => d.n))
  const total = dias.reduce((a, d) => a + d.n, 0)
  const ancho = 300 / DIAS_GRAFICA
  return (
    <section className="grafica" aria-label="Actividad de los últimos 30 días">
      <div className="grafica-cab">
        <span>Actividad · 30 días</span>
        <span>{total} {total === 1 ? 'mensaje' : 'mensajes'}</span>
      </div>
      <svg viewBox="0 0 300 70" preserveAspectRatio="none" role="img" aria-label={`${total} mensajes en los últimos 30 días`} className="grafica-svg">
        <line x1="0" y1="66" x2="300" y2="66" className="grafica-base" />
        {dias.map((d, i) => {
          const h = d.n ? Math.max(5, (d.n / max) * 58) : 2
          return (
            <motion.rect
              key={d.t}
              x={i * ancho + 1}
              width={ancho - 2}
              rx="1.5"
              className={d.n ? 'barra-on' : 'barra-off'}
              initial={{ y: 66, height: 0 }}
              animate={{ y: 66 - h, height: h }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.02, ease: 'easeOut' }}
            >
              <title>{`${new Date(d.t).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}: ${d.n}`}</title>
            </motion.rect>
          )
        })}
      </svg>
      <div className="grafica-ejes" aria-hidden="true">
        <span>hace 30 d</span>
        <span>hoy</span>
      </div>
    </section>
  )
}

const Interface = () => {
  const { mensajes, cargando, error, noAutorizado, eliminarMensaje } = useMensajes()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [restante, setRestante] = useState(msRestantes)
  const [momento] = useState(() => Date.now()) // referencia para "últimos 7 días"

  const salir = () => {
    cerrarSesion()
    // "replace": el historial no conserva el panel, así "Atrás" no puede volver a él
    navigate('/', { replace: true })
  }

  // La sesión se renueva con la actividad y se cierra sola por inactividad
  useEffect(() => {
    let ultimo = 0
    const actividad = () => {
      const t = Date.now()
      if (t - ultimo > 5000) {
        ultimo = t
        registrarActividad()
      }
    }
    ;['pointermove', 'keydown', 'click', 'scroll'].forEach((ev) => window.addEventListener(ev, actividad, { passive: true }))
    const id = setInterval(() => {
      if (!estaAutenticado()) {
        Swal.fire({
          ...swalConfig,
          icon: 'info',
          title: 'Sesión cerrada',
          text: 'Se cerró por inactividad. Vuelve a iniciar sesión.',
          confirmButtonText: 'Entendido',
        }).then(() => navigate('/admin', { replace: true }))
        clearInterval(id)
        return
      }
      setRestante(msRestantes())
    }, 1000)
    return () => {
      ;['pointermove', 'keydown', 'click', 'scroll'].forEach((ev) => window.removeEventListener(ev, actividad))
      clearInterval(id)
    }
  }, [navigate])

  // El servidor rechazó la sesión (401/403)
  useEffect(() => {
    if (noAutorizado) navigate('/admin', { replace: true })
  }, [noAutorizado, navigate])

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      ...swalConfig,
      icon: 'warning',
      title: '¿Eliminar mensaje?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e03131',
      cancelButtonColor: '#444',
    })
    if (!confirm.isConfirmed) return
    try {
      const ok = await eliminarMensaje(id)
      if (ok) {
        Swal.fire({ ...swalConfig, icon: 'success', title: 'Eliminado', text: 'El mensaje fue eliminado.', confirmButtonText: 'Ok' })
      }
    } catch {
      Swal.fire({ ...swalConfig, icon: 'error', title: 'No se pudo eliminar', text: 'Intenta de nuevo en un momento.' })
    }
  }

  const copiarCorreo = async (email) => {
    try {
      await navigator.clipboard.writeText(email)
      Swal.fire({ ...swalConfig, toast: true, position: 'top-end', timer: 1600, showConfirmButton: false, icon: 'success', title: 'Correo copiado' })
    } catch {
      Swal.fire({ ...swalConfig, icon: 'info', title: email })
    }
  }

  const cerrarSesionConfirmar = () => {
    Swal.fire({
      ...swalConfig,
      icon: 'question',
      title: '¿Seguro que quieres cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e03131',
      cancelButtonColor: '#444',
    }).then((r) => {
      if (r.isConfirmed) salir()
    })
  }

  const stats = useMemo(() => {
    const ahora = momento
    const fechas = mensajes.map((m) => new Date(m.fecha).getTime()).filter((n) => !Number.isNaN(n))
    return {
      total: mensajes.length,
      semana: fechas.filter((t) => ahora - t <= 7 * DIA).length,
      ultimo: fechas.length ? Math.max(...fechas) : null,
    }
  }, [mensajes, momento])

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const lista = q
      ? mensajes.filter((m) => `${m.nombre} ${m.email} ${m.mensaje}`.toLowerCase().includes(q))
      : [...mensajes]
    lista.sort((a, b) => (orden === 'recientes' ? new Date(b.fecha) - new Date(a.fecha) : new Date(a.fecha) - new Date(b.fecha)))
    return lista
  }, [mensajes, busqueda, orden])

  const porVencer = restante < 2 * 60 * 1000

  return (
    <div className="interface-wrapper">
      <div className="interface-container">
        <header className="interface-header">
          <div>
            <p className="interface-etiqueta">Centro de control</p>
            <h1 className="interface-titulo">Bandeja de mensajes</h1>
          </div>
          <div className="interface-sesion">
            <span className={`sesion-chip ${porVencer ? 'por-vencer' : ''}`} title={`La sesión se cierra tras ${INACTIVIDAD_MS / 60000} min sin actividad`}>
              Sesión · {mmss(restante)}
            </span>
            <button className="interface-logout" onClick={cerrarSesionConfirmar}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <motion.section className="interface-stats" aria-label="Resumen" variants={lista} initial="oculto" animate="visible">
          <motion.div className="stat-card" variants={entra}>
            <span className="stat-numero"><Contador valor={stats.total} /></span>
            <span className="stat-label">Mensajes totales</span>
          </motion.div>
          <motion.div className="stat-card" variants={entra}>
            <span className="stat-numero"><Contador valor={stats.semana} /></span>
            <span className="stat-label">Últimos 7 días</span>
          </motion.div>
          <motion.div className="stat-card" variants={entra}>
            <span className="stat-numero stat-fecha">{stats.ultimo ? fechaCorta(stats.ultimo) : '—'}</span>
            <span className="stat-label">Más reciente</span>
          </motion.div>
        </motion.section>

        {!cargando && !error && <Grafica mensajes={mensajes} momento={momento} />}

        <div className="interface-barra">
          <input
            type="search"
            className="barra-buscar"
            placeholder="Buscar por nombre, correo o texto"
            aria-label="Buscar mensajes"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select className="barra-orden" aria-label="Ordenar" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes primero</option>
            <option value="antiguos">Más antiguos primero</option>
          </select>
          <span className="barra-cuenta" aria-live="polite">{visibles.length} de {mensajes.length}</span>
        </div>

        {cargando ? (
          <p className="interface-cargando">Cargando mensajes...</p>
        ) : error ? (
          <p className="interface-vacio">❌ {error}</p>
        ) : mensajes.length === 0 ? (
          <p className="interface-vacio">No hay mensajes aún 📭</p>
        ) : visibles.length === 0 ? (
          <p className="interface-vacio">Ningún mensaje coincide con “{busqueda}”.</p>
        ) : (
          <motion.div className="mensajes-grid" layout>
            <AnimatePresence mode="popLayout">
            {visibles.map((m, i) => (
              <motion.article
                className="mensaje-card"
                key={m.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: Math.min(i, 8) * 0.05 } }}
                exit={{ opacity: 0, scale: 0.88, x: -30, transition: { duration: 0.3 } }}
              >
                <div className="mensaje-header">
                  <div className="mensaje-avatar">{(m.nombre || '?').charAt(0).toUpperCase()}</div>
                  <div className="mensaje-info">
                    <h3>{m.nombre}</h3>
                    <p>{m.email}</p>
                  </div>
                  <span className="mensaje-fecha">
                    {fechaCorta(m.fecha)}
                    <small>{hora(m.fecha)}</small>
                  </span>
                </div>
                <p className="mensaje-texto">{m.mensaje}</p>
                <div className="mensaje-acciones">
                  <a className="mensaje-btn" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: tu mensaje en mi portafolio')}`}>
                    Responder
                  </a>
                  <button type="button" className="mensaje-btn" onClick={() => copiarCorreo(m.email)}>
                    Copiar correo
                  </button>
                  <button type="button" className="mensaje-btn-eliminar" onClick={() => handleEliminar(m.id)}>
                    Eliminar
                  </button>
                </div>
              </motion.article>
            ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Interface
