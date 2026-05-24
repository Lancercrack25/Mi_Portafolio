import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './Login.css'

const Login = () => {
  const [form, setForm] = useState({ nombre: '', password: '' })
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  const swalConfig = {
    background: 'linear-gradient(to right, #0d1a64, #24163e)',
    color: '#fff',
    confirmButtonColor: '#646cff',
    confirmButtonText: 'Entendido'
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      const res = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        Swal.fire({
          ...swalConfig,
          icon: 'success',
          title: `¡Bienvenido ${form.nombre}!`,
          text: 'Acceso autorizado.',
          confirmButtonText: 'Entrar'
        }).then(() => {
          navigate('/admin/dashboard')
        })
      } else {
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
      <div className="login-cuadro">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h2 className="login-titulo">Panel Admin</h2>
          <p className="login-subtitulo">Ingresa tus credenciales</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Nombre Admin</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu usuario"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-grupo">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="login-btn"
            disabled={enviando}
          >
            {enviando ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login