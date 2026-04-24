import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './interface.css'

const Interface = () => {
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  const swalConfig = {
    background: 'linear-gradient(to right, #0d1a64, #24163e)',
    color: '#fff',
    confirmButtonColor: '#646cff',
  }

  const eliminarMensaje = async (id) => {
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

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/contacto/${id}`, {
          method: 'DELETE'
        })
        setMensajes(prev => prev.filter(m => m.id !== id))
        Swal.fire({
          ...swalConfig,
          icon: 'success',
          title: 'Eliminado',
          text: 'El mensaje fue eliminado correctamente.',
          confirmButtonText: 'Ok'
        })
      } catch {
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el mensaje.',
        })
      }
    }
  }

  const cerrarSesion = () => {
    Swal.fire({
      ...swalConfig,
      icon: 'question',
      title: '¿Cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e03131',
      cancelButtonColor: '#444',
    }).then((result) => {
      if (result.isConfirmed) navigate('/')
    })
  }

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await fetch('http://localhost:3000/contacto')
        const data = await res.json()
        setMensajes(data)
      } catch {
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los mensajes.',
        })
      } finally {
        setCargando(false)
      }
    }

    obtenerMensajes()
  }, [])

  return (
    <div className="interface-wrapper">
      <div className="interface-container">
        <div className="interface-header">
          <h1 className="interface-titulo">Panel Admin</h1>
          <button className="interface-logout" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>

        <div className="interface-stats">
          <div className="stat-card">
            <span className="stat-numero">{mensajes.length}</span>
            <span className="stat-label">Mensajes totales</span>
          </div>
        </div>

        {cargando ? (
          <p className="interface-cargando">Cargando mensajes...</p>
        ) : mensajes.length === 0 ? (
          <p className="interface-vacio">No hay mensajes aún 📭</p>
        ) : (
          <div className="mensajes-grid">
            {mensajes.map((m) => (
              <div className="mensaje-card" key={m.id}>
                <div className="mensaje-header">
                  <div className="mensaje-avatar">
                    {m.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="mensaje-info">
                    <h3>{m.nombre}</h3>
                    <p>{m.email}</p>
                  </div>
                  <span className="mensaje-fecha">
                    {new Date(m.fecha).toLocaleDateString()}
                  </span>
                </div>
                <p className="mensaje-texto">{m.mensaje}</p>
                <button
                  className="mensaje-btn-eliminar"
                  onClick={() => eliminarMensaje(m.id)}
                >
                  🗑 Denegar / Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Interface