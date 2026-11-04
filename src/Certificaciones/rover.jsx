import Grupo from './Grupo'
import { RECONOCIMIENTOS } from './datos'
import './rover.css'

// Competencias y mentorías (URC, NASA Space Apps)
const Rover = () => <Grupo titulo="Reconocimientos" datos={RECONOCIMIENTOS} destacadas clase="tr-reconocimientos" />

export default Rover
