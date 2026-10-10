import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from '../Navbar/navbar'

// El navbar vive aquí (una sola vez) para que el subrayado animado
// pueda moverse de una página a otra. Solo se anima la opacidad:
// un transform en este contenedor rompería el position: fixed del navbar.
const Layout = () => {
  const { pathname } = useLocation()
  const outlet = useOutlet()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Layout
