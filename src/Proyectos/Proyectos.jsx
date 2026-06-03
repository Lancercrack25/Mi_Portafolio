import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import './Proyectos.css'

const proyectos = [
  { nombre: "Cobaj Swimmers Rendiment", descripcion: "Sistema de gestión y análisis de rendimiento para nadadores.", lenguaje: "Python/Postgresql", link: "https://github.com/Lancercrack25/Cobaj-swimmers-rendiment" },
  { nombre: "Technest Store Angular", descripcion: "Tienda en línea de compra-venta de productos electrónicos sobre piezas de pc con bases de datos funcional", lenguaje: "Angular/node.js", link: "https://github.com/Lancercrack25/Technest-Store-angular-website" },
  { nombre: "Fit Application Tastefull", descripcion: "Aplicación de fitness y nutrición hecha para un hackathon con base de datos funcional.", lenguaje: "Java", link: "https://github.com/Lancercrack25/Fit-aplication-tastefull" },
  { nombre: "Pokemon Website", descripcion: "Sitio web de Pokemon con chatbot funcional y api de pokemones.", lenguaje: "Prolog / Angular / Node.js", link: "https://github.com/Lancercrack25/Pokemon-Website-Angular-Node.js-Prolog" },
  { nombre: "VPN Project", descripcion: "Proyecto de red privada virtual donde se aplican distintos algoritmos para su funcionamiento.", lenguaje: "Python", link: "https://github.com/Lancercrack25/vpn_proyect" },
  { nombre: "Fingers Hand Detector", descripcion: "Detector de dedos y manos con visión artificial.", lenguaje: "Python", link: "https://github.com/Lancercrack25/fingers-hand-detector" },
  { nombre: "TechNest Store", descripcion: "Tienda de tecnología desarrollada en C++ aplicando orientado a objetos.", lenguaje: "C++", link: "https://github.com/Lancercrack25/TechNest-Store" },
  { nombre: "Shop Simulator", descripcion: "Simulador de tienda desarrollado en C++.", lenguaje: "C++", link: "https://github.com/Lancercrack25/shop-simulator" },
  { nombre: "Agenda Alumnos", descripcion: "Sistema de agenda para alumnos hecho como proyecto escolar.", lenguaje: "C", link: "https://github.com/Lancercrack25/Agenda_alumnos" },
  { nombre: "Veterinary API", descripcion: "API REST para gestión de una veterinaria con microservicios de aws.", lenguaje: "JavaScript", link: "https://github.com/Lancercrack25/Veterinary-api" },
  { nombre: "Lab cameras package", descripcion: "Paquete de ros2 que incluye funcionalidades para la captura y procesamiento de imágenes de cámaras.", lenguaje: "Ros2/c++/python", link: "" },
  { nombre: "Influx node Ros2", descripcion: "Nodo para la integración con InfluxDB para la obtencion de datos de los sensores de gases, humedad y temperatura.", lenguaje: "Ros2/Python", link: "" },
  { nombre: "Mars rover General interface", descripcion: "Interfaz hecha en angular para monitoreo de funciones del rover.", lenguaje: "Angular", link: "" },
  { nombre: "Mi portafolio personal", descripcion: "Portafolio personal desarrollado en React y Node.js.", lenguaje: "React/Node.js/Postgres", link: "" },
  { nombre: "Spectro-repository", descripcion: "paquete de ros2 configuradocon python para las lectura de un archivo .csv que simila datos de un espectroreal ", lenguaje: "Ros2/python", link: "" },
  { nombre: "Mini-proyecto alumnos", descripcion: "proyecto escolar de un sistema de alumnos sencillo", lenguaje: "React/Postgres/Node.js", link: "https://github.com/Lancercrack25/mini-proyecto-alumnos" },
  { nombre: "Fuecor-website", descripcion: "sitio web de un negocio de electronica", lenguaje: "html/css/JS", link: "https://github.com/Lancercrack25/mini-proyecto-alumnos" },
  { nombre: "Beyond the click", descripcion: "Videojuego sobre el ciberacoso (Proyecto modular)", lenguaje: "c++,c#, unity hub", link: "" }
]

const Proyectos = () => {
  return (
    <div className="proyectos-container">
      <Navbar />
      <section className="proyectos-section">
        <h2 className="proyectos-titulo">
           Mis <span>Proyectos</span>
        </h2>
        <p className="proyectos-subtitulo">Conoce mas sobre mis Proyectos que he realizado</p>
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
                Ver proyecto en GitHub →
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