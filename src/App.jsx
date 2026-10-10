import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Inicio from './Inicio/inicio'
import Home from './Home/Home'
import Proyectos from './Proyectos/Proyectos'
import Contacto from './contacto/contacto'
import Login from './admin-mode/login'
import Interface from './admin-mode/interface'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Interface />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App