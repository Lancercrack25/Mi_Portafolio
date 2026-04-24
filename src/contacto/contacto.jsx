import { useState } from 'react'
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import Swal from 'sweetalert2'
import './contacto.css'

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const swalConfig = {
    background: 'linear-gradient(to right, #0d1a64, #24163e)',
    color: '#fff',
    confirmButtonColor: '#7313b3',
    confirmButtonText: 'Entendido'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor llena todos los campos antes de enviar.',
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Email inválido',
        text: 'Por favor ingresa un correo válido.',
      })
      return
    }

    setEnviando(true)

    try {
      const res = await fetch('http://localhost:3000/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setForm({ nombre: '', email: '', mensaje: '' })
        Swal.fire({
          ...swalConfig,
          icon: 'success',
          title: '¡Mensaje enviado!',
          text: 'Me pondré en contacto contigo pronto.',
          confirmButtonText: 'Cerrar'
        })
      } else {
        Swal.fire({
          ...swalConfig,
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el mensaje, intenta de nuevo.',
          confirmButtonText: 'Cerrar'
        })
      }
    } catch {
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonText: 'Cerrar'
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="contacto-container">
      <Navbar />
      <div className="contacto-cuadro">
        <h2 className="contacto-titulo">Contáctame</h2>
        <p className="contacto-subtitulo">¿Tienes algún proyecto en mente? Escríbeme</p>
        <form className="contacto-form" onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-grupo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Tu correo"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-grupo">
            <label>Mensaje</label>
            <textarea
              rows="5"
              name="mensaje"
              placeholder="Tu mensaje..."
              value={form.mensaje}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="contacto-btn"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
      <br /><br /><br /><br /><br />
      <Footer />
    </div>
  )
}

export default Contacto