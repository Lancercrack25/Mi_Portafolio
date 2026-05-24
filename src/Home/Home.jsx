import Navbar from "../Navbar/Navbar";
import Frameworks from "../Frameworks-languages/Frameworks";
import Footer from "../Footer/Footer";
import './Home.css'
import yop from "../assets/yop.jpeg";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />

      <section className="about">

        <div className="about-container">

          {/* IZQUIERDA - FOTO */}
          <div className="about-left">
            <div className="image-wrapper">
              <img src={yop} alt="Luis Jesús Lira" />
            </div>
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
              Tengo experiencia trabajando con React, Angular, Java, Python y C++, así como con Spring Boot, node.js,aws,linux, ROS2 en proyectos de robótica y mas.
            </p>

            <p>
              Actualmente integrante del equipo
              <span className="highlight"> Mars Rover UDG Space</span>,
              desarrollando soluciones en el area de science mission para asi contribuir al éxito de esta mision la cual forma parte de nuestro robot de navegacion autonoma.
            </p>

          </div>

        </div>

        {/* CARDS ABAJO */}
        <div className="about-cards">

          <div className="card">
            <h2>⚡Soft-Skills</h2>
            <p>Responsabilidad, trabajo en equipo, comunicación asertiva</p>
          </div>

          <div className="card">
            <h2>🛰️ Experiencia</h2>
            <p>Participación en proyectos reales de ingeniería y Robotica.</p>
          </div>

          <div className="card">
            <h2>🎯 Enfoque</h2>
            <p>Aprendizaje constante y desarrollo profesional.</p>
          </div>

        </div>
        
        <Frameworks />

      </section>
      <Footer />
    </div>
  )
}

export default Home