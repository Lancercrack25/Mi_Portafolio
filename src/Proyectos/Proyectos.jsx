import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Footer from '../Footer/Footer'
import './Proyectos.css'

const proyectos = [
  { nombre: "Cobaj Swimmers Rendiment", descripcion: "Sistema de gestión y análisis de rendimiento para nadadores.", tags: ["Python", "PostgreSQL"], link: "https://github.com/Lancercrack25/Cobaj-swimmers-rendiment" },
  { nombre: "Technest Store Angular", descripcion: "Tienda en línea de compra-venta de productos electrónicos sobre piezas de pc con bases de datos funcional", tags: ["Angular", "Node.js"], link: "https://github.com/Lancercrack25/Technest-Store-angular-website" },
  { nombre: "Fit Application Tastefull", descripcion: "Aplicación de fitness y nutrición hecha para un hackathon con base de datos funcional.", tags: ["Java"], link: "https://github.com/Lancercrack25/Fit-aplication-tastefull" },
  { nombre: "Pokemon Website", descripcion: "Sitio web de Pokemon con chatbot funcional y api de pokemones.", tags: ["Angular", "Node.js", "Prolog"], link: "https://github.com/Lancercrack25/Pokemon-Website-Angular-Node.js-Prolog" },
  { nombre: "VPN Project", descripcion: "Proyecto de red privada virtual donde se aplican distintos algoritmos para su funcionamiento.", tags: ["Python"], link: "https://github.com/Lancercrack25/vpn_proyect" },
  { nombre: "Fingers Hand Detector", descripcion: "Detector de dedos y manos con visión artificial.", tags: ["Python"], link: "https://github.com/Lancercrack25/fingers-hand-detector" },
  { nombre: "TechNest Store", descripcion: "Tienda de tecnología desarrollada en C++ aplicando orientado a objetos.", tags: ["C++"], link: "https://github.com/Lancercrack25/TechNest-Store" },
  { nombre: "Shop Simulator", descripcion: "Simulador de tienda desarrollado en C++.", tags: ["C++"], link: "https://github.com/Lancercrack25/shop-simulator" },
  { nombre: "Agenda Alumnos", descripcion: "Sistema de agenda para alumnos hecho como proyecto escolar.", tags: ["C"], link: "https://github.com/Lancercrack25/Agenda_alumnos" },
  { nombre: "Veterinary API", descripcion: "API REST para gestión de una veterinaria con microservicios de aws.", tags: ["JavaScript", "AWS"], link: "https://github.com/Lancercrack25/Veterinary-api" },
  { nombre: "Lab cameras package", descripcion: "Paquete de ros2 que incluye funcionalidades para la captura y procesamiento de imágenes de cámaras.", tags: ["ROS2", "C++", "Python"], link: "" },
  { nombre: "Influx node Ros2", descripcion: "Nodo para la integración con InfluxDB para la obtención de datos de los sensores de gases, humedad y temperatura.", tags: ["ROS2", "Python"], link: "" },
  { nombre: "Mars rover General interface", descripcion: "Interfaz hecha en angular para monitoreo de funciones del rover.", tags: ["Angular"], link: "" },
  { nombre: "Mi portafolio personal", descripcion: "Portafolio personal desarrollado en React y Node.js.", tags: ["React", "Node.js", "PostgreSQL"], link: "" },
  { nombre: "Spectro-repository", descripcion: "Paquete de ros2 configurado con python para la lectura de un archivo .csv que simula datos de un espectro real.", tags: ["ROS2", "Python"], link: "" },
  { nombre: "Mini-proyecto alumnos", descripcion: "Proyecto escolar de un sistema de alumnos sencillo", tags: ["React", "PostgreSQL", "Node.js"], link: "https://github.com/Lancercrack25/mini-proyecto-alumnos" },
  { nombre: "Fuecor-website", descripcion: "Sitio web de un negocio de electrónica", tags: ["HTML/CSS", "JavaScript"], link: "https://github.com/Lancercrack25/mini-proyecto-alumnos" },
  { nombre: "Beyond the click", descripcion: "Videojuego sobre el ciberacoso (Proyecto modular)", tags: ["C++", "C#", "Unity"], link: "" },
  { nombre: "Asistente Revan", descripcion: "Asistente de IA para tu ordenador", tags: ["Python", "JavaScript", "HTML/CSS"], link: "https://github.com/Lancercrack25/Revan-IA-asistent" },
]

// Foco de luz que sigue al cursor dentro de cada tarjeta (variables CSS --mx / --my)
const seguirCursor = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const Proyectos = () => {
  const [filtro, setFiltro] = useState('Todos')

  // Solo se ofrecen como filtro las tecnologías que aparecen en 2 o más proyectos
  const etiquetas = useMemo(() => {
    const conteo = {}
    proyectos.forEach((p) => p.tags.forEach((t) => { conteo[t] = (conteo[t] || 0) + 1 }))
    const frecuentes = Object.keys(conteo)
      .filter((t) => conteo[t] > 1)
      .sort((a, b) => conteo[b] - conteo[a])
    return ['Todos', ...frecuentes]
  }, [])

  const visibles = filtro === 'Todos'
    ? proyectos
    : proyectos.filter((p) => p.tags.includes(filtro))

  return (
    <div className="proyectos-container">
      <section className="proyectos-section">
        <h2 className="proyectos-titulo">
           Mis <span>Proyectos</span>
        </h2>
        <p className="proyectos-subtitulo">Conoce mas sobre mis Proyectos que he realizado</p>

        <div className="proyectos-filtros" role="group" aria-label="Filtrar por tecnología">
          {etiquetas.map((t) => (
            <button
              key={t}
              type="button"
              className={`filtro-btn ${filtro === t ? 'activo' : ''}`}
              aria-pressed={filtro === t}
              onClick={() => setFiltro(t)}
            >
              {t}
              {filtro === t && (
                <motion.span
                  layoutId="filtro-activo"
                  className="filtro-fondo"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <motion.div layout className="proyectos-grid">
          <AnimatePresence mode="popLayout">
            {visibles.map((proyecto, i) => (
              <motion.article
                layout
                key={proyecto.nombre}
                className="proyecto-card"
                onPointerMove={seguirCursor}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3, delay: Math.min(i, 9) * 0.04 },
                }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                whileHover={{ y: -8 }}
              >
                <div className="proyecto-header">
                  <h3>{proyecto.nombre}</h3>
                  <div className="proyecto-tags">
                    {proyecto.tags.map((t) => (
                      <span className="proyecto-lenguaje" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <p className="proyecto-descripcion">{proyecto.descripcion}</p>
                {proyecto.link ? (
                  <a
                    href={proyecto.link}
                    target="_blank"
                    rel="noreferrer"
                    className="proyecto-btn"
                  >
                    Ver proyecto en GitHub →
                  </a>
                ) : (
                  <span className="proyecto-btn sin-link">Repositorio no público</span>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default Proyectos
