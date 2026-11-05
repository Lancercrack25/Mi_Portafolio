import URC from '../assets/URC.png'
import curso from '../assets/curso.png'
import English from '../assets/English.png'
import web from '../assets/web.png'
import reconocimiento from '../assets/reconocimiento.png'
import Newp from '../assets/Newp.png'
import Nasa from '../assets/Nasa.png'

export const RECONOCIMIENTOS = [
  {
    id: 'urc',
    etiqueta: 'Competencia',
    titulo: 'University Rover Challenge',
    imagen: URC,
    emisor: 'Mars Society',
    rol: 'Participación · Mars Rover UDG Space',
    detalle: 'Competencia internacional de robótica espacial. Desarrollo de software del rover: sensores, visión e interfaz de monitoreo.',
    anio: '2026',
    enlace: '',
  },
  {
    id: 'mentor-local',
    etiqueta: 'Mentoría',
    titulo: 'NASA Space Apps Challenge',
    imagen: Nasa,
    emisor: 'NASA',
    rol: 'Mentor local',
    detalle: 'Hackatón internacional de la NASA en el que participé como mentor local de la zona de Guadalajara, brindando apoyo y orientación a los participantes en el desarrollo de sus proyectos.',
    anio: '2025',
    enlace: '',
  },
]

export const CERTIFICACIONES = [
  {
    id: 'cisco-ciberseguridad',
    etiqueta: 'Certificación',
    titulo: 'Ciberseguridad',
    imagen: Newp,
    emisor: 'Cisco',
    detalle: 'Certificación del curso de Ciberseguridad de Cisco Networking Academy, con conocimientos sobre seguridad en redes, protección de datos y defensa contra amenazas cibernéticas.',
    anio: '2023',
    enlace: '',
  },
  {
    id: 'cisco-redes',
    etiqueta: 'Certificación',
    titulo: 'Redes',
    imagen: reconocimiento,
    emisor: 'Cisco',
    detalle: 'Certificación del curso de Redes de Cisco Networking Academy, con conocimientos sobre diseño, implementación y gestión de redes empresariales.',
    anio: '2025',
    enlace: '',
  },
]

export const FORMACION = [
  {
    id: 'desarrollo-web',
    etiqueta: 'Diploma',
    titulo: 'Desarrollo Web',
    imagen: web,
    emisor: 'Preparatoria No. 4, UDG',
    detalle: 'Diploma por concluir satisfactoriamente el taller de Desarrollo Web: HTML, CSS, JavaScript y frameworks modernos para aplicaciones web.',
    anio: '2022',
    enlace: '',
  },
  {
    id: 'global-skills',
    etiqueta: 'Constancia',
    titulo: 'Global Skills for the Future',
    imagen: curso,
    emisor: 'Preparatoria No. 4, UDG',
    detalle: 'Constancia por concluir satisfactoriamente el taller Global Skills for the Future: liderazgo, trabajo en equipo, comunicación y pensamiento crítico.',
    anio: '2021',
    enlace: '',
  },
  {
    id: 'jobs',
    etiqueta: 'Constancia',
    titulo: 'Programa JOBS (inglés)',
    imagen: English,
    emisor: 'Universidad de Guadalajara',
    detalle: 'Certificado de participación en el programa JOBS, con los 5 niveles de inglés cumplidos satisfactoriamente.',
    anio: '2025',
    enlace: '',
  },
]