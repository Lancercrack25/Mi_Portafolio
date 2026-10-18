import { useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import Footer from '../Footer/Footer'
import ScrambleText from '../components/ScrambleText'
import FondoMarte from '../Home/FondoMarte'
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

// Tarjeta con tres efectos:
//  1. Al entrar en pantalla se "imprime" con un barrido pixelado y una línea de escaneo.
//  2. Con el mouse se inclina en 3D y el foco de luz sigue al cursor.
//  3. Al hover aparece una mira (esquinas HUD) que "fija" la tarjeta.
// Los eventos de puntero van en el "stage" (que no gira) para que el área de
// detección no cambie mientras la tarjeta rota y no haya parpadeos en los bordes.
const ProyectoCard = ({ proyecto, indice, reducir }) => {
  // Sin IntersectionObserver (navegadores muy viejos) no hay forma de saber cuándo entra: se muestra directo
  const [visto, setVisto] = useState(Boolean(reducir) || typeof IntersectionObserver === 'undefined')

  const px = useMotionValue(0) // -0.5 a 0.5
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 220, damping: 20 })
  const sy = useSpring(py, { stiffness: 220, damping: 20 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7])

  const mover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    e.currentTarget.style.setProperty('--mx', `${x}px`)
    e.currentTarget.style.setProperty('--my', `${y}px`)
    // En pantallas táctiles no se inclina: sería un tirón al arrastrar para hacer scroll
    if (!reducir && e.pointerType === 'mouse') {
      px.set(x / r.width - 0.5)
      py.set(y / r.height - 0.5)
    }
  }

  const salir = () => {
    px.set(0)
    py.set(0)
  }

  const clases = ['proyecto-card']
  if (visto) clases.push('visible')
  if (visto && !reducir) clases.push('boot')

  return (
    <div className="proyecto-stage" onPointerMove={mover} onPointerLeave={salir}>
      <motion.article
        className={clases.join(' ')}
        style={reducir ? undefined : { '--d': `${Math.min(indice, 8) * 0.06}s`, rotateX, rotateY }}
        whileHover={reducir ? undefined : { y: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        viewport={{ once: true, amount: 0.2 }}
        onViewportEnter={() => setVisto(true)}
      >
        <span className="proyecto-scan" aria-hidden="true" />
        <span className="proyecto-hud" aria-hidden="true" />

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
    </div>
  )
}

const Proyectos = () => {
  const [filtro, setFiltro] = useState('Todos')
  const reducir = useReducedMotion()

  // El planeta de fondo se acerca poco a poco mientras se recorre la lista
  const progresoRef = useRef(0)
  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progresoRef.current = v * 0.55
  })

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
      <div className="proyectos-fondo" aria-hidden="true">
        <FondoMarte progresoRef={progresoRef} reducir={Boolean(reducir)} activo />
      </div>
      <div className="proyectos-velo" aria-hidden="true" />
      <section className="proyectos-section">
        <h2 className="proyectos-titulo">
           Mis <span><ScrambleText texto="Proyectos" retraso={0.3} alHover /></span>
        </h2>
        <p className="proyectos-subtitulo">Conoce mas sobre mis Proyectos que he realizado</p>

        <p className="proyectos-estado" aria-live="polite">
          <span>Registros: {visibles.length}</span>
          <span>Filtro: {filtro}</span>
        </p>

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
              // El "slot" se encarga de la entrada/salida y del reacomodo al filtrar;
              // la inclinación 3D vive dentro, para que no choque con la animación de layout.
              <motion.div
                layout
                key={proyecto.nombre}
                className="proyecto-slot"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
              >
                <ProyectoCard proyecto={proyecto} indice={i} reducir={reducir} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      <br />
      <br />
      <div className="proyectos-pie">
        <Footer />
      </div>
    </div>
  )
}

export default Proyectos
