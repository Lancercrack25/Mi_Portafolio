import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'motion/react'
import Navbar from '../Navbar/navbar'
import PixelCurtain from './PixelCurtain'
import './Layout.css'

// El navbar vive aquí (una sola vez) para que el subrayado animado pueda moverse
// entre páginas. La transición es la cortina de pixeles: con mode="wait" la página
// anterior sale (la cortina se cierra), se cambia el contenido ya tapado, y la
// nueva entra (la cortina se abre). No se anima ningún transform en este contenedor
// porque rompería el position: fixed del navbar.
const Layout = () => {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  const reducir = useReducedMotion()
  const { scrollYProgress } = useScroll()

  return (
    <>
      <Navbar />
      <div className="scroll-progress" aria-hidden="true">
        <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} />
      </div>
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <div key={pathname}>
          {outlet}
          {!reducir && <PixelCurtain />}
        </div>
      </AnimatePresence>
    </>
  )
}

export default Layout
