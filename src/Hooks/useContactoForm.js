import { useState } from 'react'

const useContactoForm = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({ nombre: '', email: '', mensaje: '' })
  }

  const enviarMensaje = async () => {
    setEnviando(true)
    try {
      const res = await fetch('http://localhost:3000/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      return res.ok
    } catch {
      return false
    } finally {
      setEnviando(false)
    }
  }

  return { form, enviando, handleChange, resetForm, enviarMensaje }
}

export default useContactoForm