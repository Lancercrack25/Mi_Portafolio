import FondoTecnico from '../Home/FondoTecnico'
import Footer from '../Footer/Footer'
import Trayectoria from './Trayectoria'

// Página propia (/trayectoria): mismo fondo de cielo que Inicio + la sección + el pie de página.
const PaginaTrayectoria = () => (
  <div className="home-container">
    <FondoTecnico />
    <Trayectoria />
    <Footer />
  </div>
)

export default PaginaTrayectoria