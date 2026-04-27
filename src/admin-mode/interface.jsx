import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import useMensajes from '../hooks/useMensajes'
import './interface.css'

const swalConfig = {
  background: 'linear-gradient(to right, #0d1a64, #24163e)',
  color: '#fff',
  confirmButtonColor: '#646cff',
}

const Interface = () => {
  const { mensajes, cargando, error, eliminarMensaje } = useMensajes()
  const navigate = useNavigate()

  const handleEliminar = async (id) => {
    console.log('click en eliminar, id:', id)
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

    console.log('confirm resultado:', confirm)

    if (confirm.isConfirmed) {
      console.log('confirmado, eliminando...')
      await eliminarMensaje(id)
      Swal.fire({
        ...swalConfig,
        icon: 'success',
        title: 'Eliminado',
        text: 'El mensaje fue eliminado correctamente de la bandeja de inicio.',
        confirmButtonText: 'Ok'
      })
    }
  }

  const cerrarSesion = () => {
    Swal.fire({
      ...swalConfig,
      icon: 'question',
      title: '¿Esta seguro de querer cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e03131',
      cancelButtonColor: '#444',
    }).then((result) => {
      if (result.isConfirmed) navigate('/')
    })
  }

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
        ) : error ? (
          <p className="interface-vacio">❌ {error}</p>
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
                  onClick={() => {
                    console.log('click en:', m.id)
                    handleEliminar(m.id)
                  }}
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