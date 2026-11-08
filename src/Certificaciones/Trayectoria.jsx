import ScrambleText from '../components/ScrambleText'
import Rover from './rover'
import Certificacion from './certificacion'
import Formacion from './formacion'

// Sección completa. En Home.jsx solo hace falta: <Trayectoria />
const Trayectoria = () => (
  <section className="tr" aria-labelledby="tr-titulo">
    <h2 className="tr-titulo" id="tr-titulo">
      <ScrambleText texto="Trayectoria" modo="decodificar" retraso={0.2} duracion={1.1} />
    </h2>
    <p className="tr-intro"> En esta sección, comparto mis competencias, mentorías y formación que respaldan lo que construyo.</p>
    <Rover />
    <Certificacion />
    <Formacion />
  </section>
)

export default Trayectoria
