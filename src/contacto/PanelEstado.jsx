import { useEffect, useState } from 'react'
import { DATOS } from './datos'

// Si la zona horaria está mal escrita, Intl lanza un error: se cae a la hora del dispositivo
// en vez de romper toda la página.
const crearFormato = (zona) => {
  const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }
  try {
    return new Intl.DateTimeFormat('es-MX', { ...opciones, timeZone: zona })
  } catch {
    return new Intl.DateTimeFormat('es-MX', opciones)
  }
}

const formato = crearFormato(DATOS.zonaHoraria)

// El reloj vive en su propio componente para que el tic de cada segundo
// no vuelva a dibujar el resto del panel.
const Reloj = () => {
  const [hora, setHora] = useState(() => formato.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setHora(formato.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return <span className="panel-hora">{hora}</span>
}

const copiarTexto = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    try {
      const t = document.createElement('textarea')
      t.value = texto
      t.style.position = 'fixed'
      t.style.opacity = '0'
      document.body.appendChild(t)
      t.select()
      const ok = document.execCommand('copy')
      t.remove()
      return ok
    } catch {
      return false
    }
  }
}

const PanelEstado = () => {
  const [copia, setCopia] = useState('') // '', 'ok' o 'error'

  const copiarCorreo = async () => {
    const ok = await copiarTexto(DATOS.correo)
    setCopia(ok ? 'ok' : 'error')
    setTimeout(() => setCopia(''), 2000)
  }

  return (
    <aside className="contacto-panel" aria-label="Disponibilidad y canales de contacto">
      <div>
        <p className="panel-estado">
          <span className={`punto-estado ${DATOS.disponible ? '' : 'apagado'}`} aria-hidden="true" />
          {DATOS.disponible ? 'Disponible' : 'No disponible por ahora'}
        </p>
        {DATOS.disponibilidad && <p className="panel-texto">{DATOS.disponibilidad}</p>}
        {DATOS.tiempoRespuesta && <p className="panel-texto">{DATOS.tiempoRespuesta}</p>}
      </div>

      <div className="panel-ubicacion">
        <div className="radar" aria-hidden="true">
          <span className="radar-barrido" />
          <span className="radar-ping" />
          <span className="radar-punto" />
        </div>
        <div>
          <p className="panel-lugar">{DATOS.ubicacion}</p>
          <Reloj />
          <p className="panel-texto">Hora local</p>
        </div>
      </div>

      <ul className="panel-canales">
        {DATOS.correo && (
          <li className="canal">
            <span className="canal-nombre">Correo</span>
            <a className="canal-valor" href={`mailto:${DATOS.correo}`}>{DATOS.correo}</a>
            <button type="button" className="canal-btn" onClick={copiarCorreo}>
              {copia === 'ok' ? 'Copiado' : copia === 'error' ? 'No se pudo' : 'Copiar'}
            </button>
          </li>
        )}
        {DATOS.linkedin && (
          <li className="canal">
            <span className="canal-nombre">LinkedIn</span>
            <a className="canal-valor" href={DATOS.linkedin} target="_blank" rel="noopener noreferrer">Ver perfil</a>
          </li>
        )}
        {DATOS.github && (
          <li className="canal">
            <span className="canal-nombre">GitHub</span>
            <a className="canal-valor" href={DATOS.github} target="_blank" rel="noopener noreferrer">Ver perfil</a>
          </li>
        )}
        {DATOS.cv && (
          <li className="canal">
            <span className="canal-nombre">CV</span>
            <a className="canal-valor" href={DATOS.cv} download>Descargar PDF</a>
          </li>
        )}
      </ul>
    </aside>
  )
}

export default PanelEstado
