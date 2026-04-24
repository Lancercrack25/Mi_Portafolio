import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import './Proyectos.css'

const proyectos = [
  { nombre: "Cobaj Swimmers Rendiment", descripcion: "Sistema de gestión y análisis de rendimiento para nadadores.", lenguaje: "Python/Postgresql", link: "https://github.com/Lancercrack25/Cobaj-swimmers-rendiment" },
  { nombre: "Technest Store Angular", descripcion: "Tienda en línea desarrollada con Angular, node y Postgresql.", lenguaje: "HTML / Angular/node.js", link: "https://github.com/Lancercrack25/Technest-Store-angular-website" },
  { nombre: "Fit Application Tastefull", descripcion: "Aplicación de fitness y nutrición.", lenguaje: "Java", link: "https://github.com/Lancercrack25/Fit-aplication-tastefull" },
  { nombre: "Pokemon Website", descripcion: "Sitio web de Pokemon con Angular, Node.js y Prolog.", lenguaje: "Prolog / Angular / Node.js", link: "https://github.com/Lancercrack25/Pokemon-Website-Angular-Node.js-Prolog" },
  { nombre: "VPN Project", descripcion: "Proyecto de red privada virtual.", lenguaje: "Python", link: "https://github.com/Lancercrack25/vpn_proyect" },
  { nombre: "Fingers Hand Detector", descripcion: "Detector de dedos y manos con visión artificial.", lenguaje: "Python", link: "https://github.com/Lancercrack25/fingers-hand-detector" },
  { nombre: "TechNest Store", descripcion: "Tienda de tecnología desarrollada en C++.", lenguaje: "C++", link: "https://github.com/Lancercrack25/TechNest-Store" },
  { nombre: "Shop Simulator", descripcion: "Simulador de tienda desarrollado en C++.", lenguaje: "C++", link: "https://github.com/Lancercrack25/shop-simulator" },
  { nombre: "Agenda Alumnos", descripcion: "Sistema de agenda para alumnos.", lenguaje: "C", link: "https://github.com/Lancercrack25/Agenda_alumnos" },
  { nombre: "Veterinary API", descripcion: "API REST para gestión de una veterinaria.", lenguaje: "JavaScript", link: "https://github.com/Lancercrack25/Veterinary-api" },
  { nombre: "Lab cameras package", descripcion: "Paquete de ros2 que incluye funcionalidades para la captura y procesamiento de imágenes de cámaras.", lenguaje: "Ros2/c++/python", link: "" },
  { nombre: "Influx node Ros2", descripcion: "Nodo para la integración con InfluxDB para la obtencion de datos de los sensores de gases, humedad y temperatura.", lenguaje: "Ros2/Python", link: "" },
  { nombre: "Mars rover General interface", descripcion: "Interfaz hecha en angular para monitoreo de funciones del rover.", lenguaje: "Angular", link: "" },
  { nombre: "Mi portafolio personal", descripcion: "Portafolio personal desarrollado en React y Node.js.", lenguaje: "React/Node.js/Postgres", link: "" },
  { nombre: "Spectro-repository", descripcion: "paquete de ros2 configuradocon python para las lectura de un archivo .csv que simila datos de un espectroreal ", lenguaje: "Ros2/python", link: "" },
  { nombre: "Statics websites", descripcion: "Sitios web estáticos que fueron hechos para trabajos, en total son 3", lenguaje: "HTML/CSS/JavaScript", link: "" },
]

const Proyectos = () => {
  return (
    <div className="proyectos-container">
      <Navbar />
      <section className="proyectos-section">
        <h2 className="proyectos-titulo">
           Mis <span>Proyectos</span>
        </h2>
        <p className="proyectos-subtitulo">Conoce mas sobre mis  Proyectos que he realizado</p>
        <div className="proyectos-grid">
          {proyectos.map((proyecto, i) => (
            <div className="proyecto-card" key={i}>
              <div className="proyecto-header">
                <h3>{proyecto.nombre}</h3>
                <span className="proyecto-lenguaje">{proyecto.lenguaje}</span>
              </div>
              <p className="proyecto-descripcion">{proyecto.descripcion}</p>
              <a
                href={proyecto.link}
                target="_blank"
                rel="noreferrer"
                className="proyecto-btn"
              >
                Ver en GitHub →
              </a>
            </div>
          ))}
        </div>
      </section>
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default Proyectos