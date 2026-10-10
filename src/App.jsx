import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './Layout/Layout'
import Inicio from './Inicio/inicio'
import Home from './Home/Home'
import Proyectos from './Proyectos/Proyectos'
import Contacto from './contacto/contacto'
import Login from './admin-mode/login'
import Interface from './admin-mode/interface'
import './App.css'

function App() {
  return (
    // reducedMotion="user": si el sistema pide menos movimiento, motion desactiva las animaciones de transformación
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Interface />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App