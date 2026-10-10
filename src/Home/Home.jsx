import { motion } from 'motion/react'
import Frameworks from '../Frameworks-languages/Frameworks'
import Footer from '../Footer/Footer'
import TiltImage from './TiltImage'
import './Home.css'
import yop from '../assets/yop.jpeg'

const tarjetas = [
  {
    titulo: '⚡Soft-Skills',
    texto: 'Responsabilidad, trabajo en equipo, comunicación asertiva, liderazgo, gestión del tiempo',
  },
  {
    titulo: '🛰️ Experiencia',
    texto: 'Participación en proyectos semiprofesionales, mentor, participante de la URC de robótica, clasificado entre los 15 mejores de la URC a nivel internacional',
  },
  {
    titulo: '🎯 Enfoque',
    texto: 'Aprendizaje constante y desarrollo profesional.',
  },
]

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const tarjeta = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const Home = () => {
  return (
    <div className="home-container">
      <section className="about">

        <div className="about-container">

          {/* IZQUIERDA - FOTO */}
          <div className="about-left">
            <TiltImage src={yop} alt="Luis Jesús Lira" />
          </div>

          {/* DERECHA - INFO */}
          <div className="about-right">

            <h1>
              Luis Jesús Lira
            </h1>
            <br />
            <h3>Desarrollador de Software</h3>

            <p>
             Me dedico al desarrollo de software enfocado en construir interfaces modernas y sistemas funcionales que combinan buen diseño con eficiencia.
            </p>

            <p>
              Tengo experiencia trabajando con React, Angular, Java, Python y C++, así como con Spring Boot, Node.js, AWS, Linux, ROS2 en proyectos de robótica y más.
            </p>

            <p>
              Actualmente integrante del equipo
              <span className="highlight"> Mars Rover UDG Space</span>,
              desarrollando soluciones en el área de science mission para así contribuir al éxito de esta misión, la cual forma parte de nuestro robot de navegación autónoma.
            </p>

          </div>

        </div>

        {/* CARDS ABAJO */}
        <motion.div
          className="about-cards"
          variants={contenedor}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {tarjetas.map((t) => (
            <motion.div
              className="about-card"
              key={t.titulo}
              variants={tarjeta}
              whileHover={{ y: -10 }}
            >
              <h2>{t.titulo}</h2>
              <p>{t.texto}</p>
            </motion.div>
          ))}
        </motion.div>

        <Frameworks />

      </section>
      <Footer />
    </div>
  )
}

export default Home