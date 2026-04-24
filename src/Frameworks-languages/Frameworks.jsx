import { useEffect, useRef } from 'react'
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
  { title: "React", img: reacts, link: "#" },
  { title: "Angular", img: angular, link: "#" },
  { title: "Java", img: java, link: "#" },
  { title: "Python", img: python, link: "#" },
  { title: "C++", img: c, link: "#" },
  { title: "Spring Boot", img: spring, link: "#" },
  { title: "ROS2", img: ros2, link: "#" },
  { title: "Github", img: github, link: "#" },
  { title: "Linux", img: linux, link: "#" },
  { title: "AWS", img: aws, link: "#" },
  { title: "Postman", img: postman, link: "#" },
  { title: "Node.js", img: node, link: "#" },
  { title: "PostgreSQL", img: postgres, link: "#" },
  { title: "InfluxDB", img: influx, link: "#" },
  { title: "JavaScript", img: javascript, link: "#" },
  { title: "HTML/CSS", img: both, link: "#" }
]

const Frameworks = () => {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    let scrollAmount = 0

    const interval = setInterval(() => {
      if (!container) return
      scrollAmount += 1
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0
      }
      container.scrollLeft = scrollAmount
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="frameworks">
      <h2 className="frameworks-title">Lenguajes/frameworks & Tecnologías</h2>
      <div className="frameworks-carousel" ref={ref}>
        {frameworks.concat(frameworks).map((f, i) => (
          <div className="card" key={i}>
            <img src={f.img} alt={f.title} />
            <p className="card-title">{f.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Frameworks