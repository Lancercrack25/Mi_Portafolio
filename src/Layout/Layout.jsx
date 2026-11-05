import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'motion/react'
import Navbar from '../Navbar/navbar'
import PixelCurtain from './PixelCurtain'
import './Layout.css'

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
