import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { motion, useAnimationControls } from 'motion/react'
import Starfield from '../Inicio/Starfield'
import { API_URL } from '../config'
import { iniciarSesion } from './auth'
import './login.css'
import './login-extra.css'

const Login = () => {
  const [form, setForm] = useState({ nombre: '', password: '' })
  const [enviando, setEnviando] = useState(false)
  const [verPassword, setVerPassword] = useState(false)
  // Freno contra intentos repetidos: tras 5 fallos seguidos hay que esperar (30 s y se duplica).
  // Es solo una molestia en el navegador; el límite real tiene que estar en el servidor.
  const [fallos, setFallos] = useState(0)
  const [bloqueoHasta, setBloqueoHasta] = useState(0)
  const [ahora, setAhora] = useState(() => Date.now())
  const bloqueado = bloqueoHasta > ahora
  const navigate = useNavigate()
  const velocidad = useRef(0.12) // estrellas a la deriva, tranquilas
  const sacudir = useAnimationControls()

  const swalConfig = {
    background: 'linear-gradient(to right, #0d1a64, #24163e)',
    color: '#fff',
    confirmButtonColor: '#646cff',
    confirmButtonText: 'Entendido'
  }

  useEffect(() => {
    if (!bloqueado) return
    const id = setInterval(() => setAhora(Date.now()), 500)
    return () => clearInterval(id)
  }, [bloqueado])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bloqueado) return

    if (!form.nombre.trim() || !form.password.trim()) {
      Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor ingresa tu usuario y contraseña.',
      })
      return
    }

    setEnviando(true)

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        // Se guarda la sesión (y el token, si el servidor lo envía) y se entra con "replace":
        // así "Atrás" desde el panel no vuelve al formulario de login.
        iniciarSesion(data.token)
        setFallos(0)
        Swal.fire({
          ...swalConfig,
          icon: 'success',
          title: `¡Bienvenido ${form.nombre}!`,
          text: 'Acceso autorizado.',
          confirmButtonText: 'Entrar'
        }).then(() => {
          navigate('/admin/dashboard', { replace: true })
        })
      } else {
        const n = fallos + 1
        setFallos(n)
        sacudir.start({ x: [0, -12, 12, -8, 8, -3, 0], transition: { duration: 0.45 } })
        if (n >= 5) {
          const espera = 30000 * 2 ** Math.min(Math.floor(n / 5) - 1, 5)
          setBloqueoHasta(Date.now() + espera)
          setAhora(Date.now())
        }
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Acceso denegado',
          text: data.error || 'Credenciales incorrectas.',
        })
      }
    } catch {
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar con el servidor.',
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-container">
      <Starfield velocidadRef={velocidad} />
      <div className="login-resplandor" aria-hidden="true" />
      <motion.div
        className="login-cuadro"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div animate={sacudir}>
          <span className="login-esq login-esq-ai" aria-hidden="true" />
          <span className="login-esq login-esq-ad" aria-hidden="true" />
          <span className="login-esq login-esq-bi" aria-hidden="true" />
          <span className="login-esq login-esq-bd" aria-hidden="true" />
          <span className="login-haz" aria-hidden="true" />

          <div className="login-header">
            <p className="login-etiqueta">Acceso restringido</p>
            <h2 className="login-titulo">Panel Admin</h2>
            <p className="login-subtitulo">Ingresa tus credenciales. La sesión se cierra tras 15 min sin actividad.</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label htmlFor="admin-nombre">Nombre Admin</label>
              <input
                id="admin-nombre"
                type="text"
                name="nombre"
                placeholder="Tu usuario"
                value={form.nombre}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div className="form-grupo">
              <label htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                type={verPassword ? 'text' : 'password'}
                name="password"
                placeholder="Tu contraseña"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-ver"
                onClick={() => setVerPassword((v) => !v)}
                aria-pressed={verPassword}
              >
                {verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </button>
            </div>
            <button type="submit" className="login-btn" disabled={enviando || bloqueado}>
              {bloqueado
                ? `Espera ${Math.ceil((bloqueoHasta - ahora) / 1000)} s`
                : enviando ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
