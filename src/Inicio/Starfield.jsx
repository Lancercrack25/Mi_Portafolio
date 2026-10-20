import { useEffect, useRef } from 'react'

const COLORES = ['#ffffff', '#ffffff', '#ffffff', '#9ae8ff', '#04ebf3', '#ff6b6b']
const Starfield = ({ velocidadRef }) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
    let ancho = 0
    let alto = 0
    let raf = 0
    let ultimo = performance.now()
    let estrellas = []

    const nueva = (z) => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
    })

    const proyectar = (e, z) => {
      const f = Math.max(ancho, alto) * 0.5 * 0.35
      return [ancho / 2 + mouse.sx + (e.x / z) * f, alto / 2 + mouse.sy + (e.y / z) * f]
    }

    const ajustar = () => {
      ancho = canvas.clientWidth
      alto = canvas.clientHeight
      canvas.width = ancho * dpr
      canvas.height = alto * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cantidad = ancho < 600 ? 180 : 380
      estrellas = Array.from({ length: cantidad }, () => nueva(Math.random()))
    }

    const dibujar = (ahora) => {
      const dt = Math.min((ahora - ultimo) / 1000, 0.05)
      ultimo = ahora
      const v = reducir ? 0 : (velocidadRef?.current ?? 0.08)

      mouse.sx += (mouse.x - mouse.sx) * 0.05
      mouse.sy += (mouse.y - mouse.sy) * 0.05

      ctx.clearRect(0, 0, ancho, alto)

      for (let i = 0; i < estrellas.length; i++) {
        let e = estrellas[i]
        e.z -= v * dt
        if (e.z <= 0.03) {
          e = estrellas[i] = nueva(1)
        }

        let [x, y] = proyectar(e, e.z)
        if (x < -20 || x > ancho + 20 || y < -20 || y > alto + 20) {
          e = estrellas[i] = nueva(1)
          ;[x, y] = proyectar(e, e.z)
        }

        const tam = Math.max(1, Math.round((1 - e.z) * 3.2))
        ctx.globalAlpha = Math.min(1, (1 - e.z) * 1.6 + 0.25)

        if (v > 0.4) {
          // Hiperespacio: raya desde donde estaba la estrella hace un instante
          const [px, py] = proyectar(e, Math.min(1.6, e.z + v * 0.12))
          ctx.strokeStyle = e.color
          ctx.lineWidth = tam
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(x, y)
          ctx.stroke()
        } else {
          ctx.fillStyle = e.color
          ctx.fillRect(Math.round(x), Math.round(y), tam, tam)
        }
      }
      ctx.globalAlpha = 1

      if (!reducir) raf = requestAnimationFrame(dibujar)
    }

    const alMover = (ev) => {
      mouse.x = (ev.clientX / window.innerWidth - 0.5) * -40
      mouse.y = (ev.clientY / window.innerHeight - 0.5) * -40
    }

    ajustar()
    raf = requestAnimationFrame(dibujar)
    window.addEventListener('resize', ajustar)
    window.addEventListener('pointermove', alMover)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', ajustar)
      window.removeEventListener('pointermove', alMover)
    }
  }, [velocidadRef])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

export default Starfield
