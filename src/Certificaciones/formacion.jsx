import Grupo from './Grupo'
import { FORMACION } from './datos'
import './formacion.css'

// Línea de tiempo: lo más reciente arriba (se ordena por el primer año que aparezca en "anio")
const anio = (d) => parseInt(String(d.anio).match(/\d{4}/)?.[0] ?? '0', 10)
const ORDENADA = [...FORMACION].sort((a, b) => anio(b) - anio(a))

const Formacion = () => <Grupo titulo="Formación" datos={ORDENADA} clase="tr-formacion" linea />

export default Formacion
