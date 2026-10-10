import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const useMensajes = () => {
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const res = await fetch(`${API_URL}/contacto`)
        const data = await res.json()
        setMensajes(data)
      } catch {
        setError('No se pudieron cargar los mensajes')
      } finally {
        setCargando(false)
      }
    }
    obtenerMensajes()
  }, [])

  const eliminarMensaje = async (id) => {
    await fetch(`${API_URL}/contacto/${id}`, { method: 'DELETE' })
    setMensajes(prev => prev.filter(m => m.id !== id))
  }

  return { mensajes, cargando, error, eliminarMensaje }
}

export default useMensajes