import Footer from '../Footer/Footer'
import Trayectoria from './Trayectoria'
import FondoTrayectoria from './FondoTrayectoria'
import './FondoTrayectoria.css'

// Página propia (/trayectoria): fondo propio (diagrama orbital Tierra → Marte), la sección y el pie.
const PaginaTrayectoria = () => (
  <div className="tr-pagina">
    <FondoTrayectoria />
    <Trayectoria />
    <Footer />
  </div>
)

export default PaginaTrayectoria
