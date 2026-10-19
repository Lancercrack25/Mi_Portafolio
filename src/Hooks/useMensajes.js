import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { cabecerasAuth, cerrarSesion } from '../admin-mode/auth'

// Mensajes del panel admin. Envía el token de sesión y, si el servidor responde
// 401/403 (sesión vencida o sin permiso), marca "noAutorizado" para volver al login.
const useMensajes = () => {
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [noAutorizado, setNoAutorizado] = useState(false)

  const rechazado = (res) => {
    if (res.status === 401 || res.status === 403) {
      cerrarSesion()
      setNoAutorizado(true)
      return true
    }
    return false
  }

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await fetch(`${API_URL}/contacto`, { headers: cabecerasAuth() })
        if (rechazado(res)) return
        if (!res.ok) throw new Error('respuesta no válida')
        const data = await res.json()
        setMensajes(Array.isArray(data) ? data : [])
      } catch {
        setError('No se pudieron cargar los mensajes')
      } finally {
        setCargando(false)
      }
    }
    obtenerMensajes()
  }, [])

  const eliminarMensaje = async (id) => {
    const res = await fetch(`${API_URL}/contacto/${id}`, { method: 'DELETE', headers: cabecerasAuth() })
    if (rechazado(res)) return false
    if (!res.ok) throw new Error('No se pudo eliminar')
    setMensajes((prev) => prev.filter((m) => m.id !== id))
    return true
  }

  return { mensajes, cargando, error, noAutorizado, eliminarMensaje }
}

export default useMensajes
