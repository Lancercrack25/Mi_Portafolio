import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        <h2 className="footer-title">
          Conoce mas sobre mi
        </h2>

        <p className="footer-text">
          visita mis redes sociales para conocer mas sobre mi experiencia, proyectos y habilidades. Estoy abierto a nuevas oportunidades y colaboraciones, asi que no dudes en contactarme.
        </p>

        {/* REDES */}
        <div className="footer-socials">

          <a 
            href="https://github.com/Lancercrack25" 
            target="_blank" 
            rel="noreferrer"
          >
            GitHub
          </a>

          <a 
            href="https://www.linkedin.com/" 
            target="_blank" 
            rel="noreferrer"
          >
            LinkedIn
          </a>

        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Todos los derechos reservados
        </p>

      </div>

    </footer>
  )
}
export default Footer