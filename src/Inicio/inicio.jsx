import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './inicio.css'

const Inicio = () => {
  const navigate = useNavigate()
  const [animando, setAnimando] = useState(false)

  const handleEntrar = () => {
    setAnimando(true)
    setTimeout(() => {
      navigate('/home')
    }, 1000)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'ñ') {
        navigate('/admin')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className={`inicio-container ${animando ? 'fadeout' : ''}`}>
      <div className="inicio-cuadro">
        <h1>Bienvenido a mi portafolio</h1>
        <p>Lancercrack25, desarrollador de software</p>
        <button onClick={handleEntrar} className="inicio-btn">
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Inicio