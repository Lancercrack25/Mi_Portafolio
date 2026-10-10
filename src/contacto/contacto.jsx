import Footer from "../Footer/Footer"
import Swal from 'sweetalert2'
import useContactoForm from '../Hooks/useContactoForm.js'
import './contacto.css'

const swalConfig = {
  background: 'linear-gradient(to right, #0d1a64, #24163e)',
  color: '#e8e4e4',
  confirmButtonColor: '#7313b3',
  confirmButtonText: 'Entendido'
}

const Contacto = () => {
  const { form, enviando, handleChange, resetForm, enviarMensaje } = useContactoForm()

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

    const exito = await enviarMensaje()

    if (exito) {
      resetForm()
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
  }

  return (
    <div className="contacto-container">
      <div className="contacto-cuadro">
        <h2 className="contacto-titulo">Contáctame</h2>
        <p className="contacto-subtitulo">¿Tienes algún proyecto en mente? Escríbeme</p>
        <form className="contacto-form" onSubmit={handleSubmit} noValidate>
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
              type="email"
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