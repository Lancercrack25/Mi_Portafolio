import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Lancercrack25</span>
      </div>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <Link className={isActive('/home')} to="/home">Inicio</Link>
        <Link className={isActive('/proyectos')} to="/proyectos">Proyectos</Link>
        <Link className={isActive('/contacto')} to="/contacto">Contacto</Link>
      </div>

      <div className={`hamburger ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}
export default Navbar