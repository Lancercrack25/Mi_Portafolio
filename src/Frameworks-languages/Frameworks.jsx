import './Frameworks.css'
import angular from "../assets/angular.webp"
import reacts from "../assets/reacts.webp"
import java from "../assets/java.webp"
import python from "../assets/python.webp"
import c from "../assets/c.webp"
import spring from "../assets/spring.webp"
import ros2 from "../assets/ros2.webp"
import github from "../assets/git.webp"
import linux from "../assets/linux.webp"
import aws from "../assets/aws.webp"
import postman from "../assets/postman.webp"
import node from "../assets/node.webp"
import postgres from "../assets/postgres.webp"
import influx from "../assets/influx.webp"
import javascript from "../assets/javascript.webp"
import both from "../assets/both.webp"

const frameworks = [
  { title: "React", img: reacts },
  { title: "Angular", img: angular },
  { title: "Java", img: java },
  { title: "Python", img: python },
  { title: "C++", img: c },
  { title: "Spring Boot", img: spring },
  { title: "ROS2", img: ros2 },
  { title: "Github", img: github },
  { title: "Linux", img: linux },
  { title: "AWS", img: aws },
  { title: "Postman", img: postman },
  { title: "Node.js", img: node },
  { title: "PostgreSQL", img: postgres },
  { title: "InfluxDB", img: influx },
  { title: "JavaScript", img: javascript },
  { title: "HTML/CSS", img: both }
]

// Se renderiza dos veces: la copia (oculta a lectores de pantalla)
// permite que el bucle de CSS no tenga saltos.
const TechSet = ({ copia = false }) => (
  <ul className="tech-set" aria-hidden={copia || undefined}>
    {frameworks.map((f) => (
      <li className="tech-card" key={f.title}>
        <img src={f.img} alt={copia ? '' : f.title} />
        <p className="tech-card-title">{f.title}</p>
      </li>
    ))}
  </ul>
)

const Frameworks = () => (
  <section className="frameworks">
    <h2 className="frameworks-title">Lenguajes/frameworks & Tecnologías</h2>
    <div className="tech-carousel">
      <div className="tech-track">
        <TechSet />
        <TechSet copia />
      </div>
    </div>
  </section>
)

export default Frameworks
