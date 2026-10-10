import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'motion/react'
import './navbar.css'

const enlaces = [
  { to: '/home', texto: 'Inicio' },
  { to: '/proyectos', texto: 'Proyectos' },
  { to: '/contacto', texto: 'Contacto' },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Lancercrack25</span>
      </div>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {enlaces.map(({ to, texto }) => {
          const activo = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={activo ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {texto}
              {activo && (
                <motion.span
                  layoutId="nav-underline"
                  className="nav-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          )
        })}
      </div>

      <div
        className={`hamburger ${open ? 'active' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen(!open)
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}

export default Navbar
