import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './Layout/Layout'
import Inicio from './Inicio/inicio'
import Home from './Home/Home'
import Proyectos from './Proyectos/Proyectos'
import Contacto from './contacto/contacto'
import Login from './admin-mode/login'
import Interface from './admin-mode/interface'
import RutaProtegida from './admin-mode/RutaProtegida'
import { cerrarSesion } from './admin-mode/auth'
import './App.css'

// La sesión de administrador termina en cuanto se sale de las rutas /admin
// (por ejemplo, al pasar al modo público). Así, "Atrás" nunca regresa al panel ya abierto.
const ControlSesion = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!pathname.startsWith('/admin')) cerrarSesion()
  }, [pathname])
  return null
}

function App() {
  return (
    // reducedMotion="user": si el sistema pide menos movimiento, motion desactiva las animaciones de transformación
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ControlSesion />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>
          <Route path="/admin" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <RutaProtegida>
                <Interface />
              </RutaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
export default App
