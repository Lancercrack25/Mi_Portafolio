import { Component, lazy, Suspense, useState } from 'react'
import './FondoMarte.css'

// La escena 3D (three.js) pesa bastante: se descarga aparte, después del resto de la página.
const EscenaMarte = lazy(() => import('./EscenaMarte'))

const hayWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Si la escena falla al cargar (sin conexión, por ejemplo), la página sigue funcionando
class LimiteError extends Component {
  state = { fallo: false }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  render() {
    return this.state.fallo ? this.props.respaldo : this.props.children
  }
}

const PlanetaCSS = () => <div className="planeta-css" aria-hidden="true" />

// Planeta 3D con respaldo en CSS cuando no hay WebGL o la escena no carga.
const FondoMarte = ({ progresoRef, reducir, activo }) => {
  const [webgl] = useState(hayWebGL)
  if (!webgl) return <PlanetaCSS />
  return (
    <LimiteError respaldo={<PlanetaCSS />}>
      <Suspense fallback={<PlanetaCSS />}>
        <EscenaMarte progresoRef={progresoRef} reducir={reducir} activo={activo} />
      </Suspense>
    </LimiteError>
  )
}

export default FondoMarte
