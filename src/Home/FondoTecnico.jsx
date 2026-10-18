import { useEffect, useRef } from 'react'
import planoRover from '../assets/rover-plano.webp'
import './FondoTecnico.css'

// Fondo de Inicio: un cielo nocturno donde astronomía, espacio y programación conviven.
//  - Vía Láctea, estrellas que parpadean y nebulosas tenues.
//  - Dos constelaciones con forma de símbolos de código: </> y { }.
//  - Marte con un satélite en órbita, la Luna con su fase real de hoy y meteoros.
//  - Un panel de código que se escribe solo: la velocidad orbital alrededor de Marte.
//  - El contorno de tu rover (de tu foto) en una esquina.
// Todo va en los márgenes y con poca opacidad: el texto sigue siendo lo principal.

const CIAN = '46, 231, 255'
const MES = 29.530588

// Generador con semilla: el cielo no cambia cada vez que se redimensiona la ventana
const rng = (semilla) => {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Fase lunar real de hoy (mes sinódico desde la luna nueva del 6-ene-2000 18:14 UTC)
const faseLunar = (fecha = new Date()) => {
  const dias = (fecha.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000
  const edad = ((dias % MES) + MES) % MES
  const angulo = (edad / MES) * Math.PI * 2
  return { creciente: edad < MES / 2, k: Math.cos(angulo), iluminada: (1 - Math.cos(angulo)) / 2 }
}

const dibujarLuna = (g, x, y, r, fase) => {
  g.save()
  g.translate(x, y)
  g.fillStyle = 'rgba(255, 255, 255, 0.05)'
  g.beginPath()
  g.arc(0, 0, r, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = `rgba(${CIAN}, 0.35)`
  g.lineWidth = 1
  g.stroke()
  // Parte iluminada: semicírculo + elipse que hace de terminador
  g.scale(fase.creciente ? 1 : -1, 1)
  g.fillStyle = 'rgba(225, 245, 255, 0.55)'
  g.beginPath()
  g.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false)
  g.save()
  g.scale(Math.max(Math.abs(fase.k), 0.001), 1)
  g.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, fase.k > 0)
  g.restore()
  g.fill()
  g.restore()
}

// ---------- Constelaciones con forma de código (coordenadas 0..1 dentro de su caja) ----------
const LLAVE_IZQ = [[0.62, 0], [0.42, 0.1], [0.42, 0.4], [0.2, 0.5], [0.42, 0.6], [0.42, 0.9], [0.62, 1]]
const espejo = (pts) => pts.map(([x, y]) => [1 - x, y])
const CONSTELACIONES = {
  etiqueta: [
    // < / >
    [[0.3, 0.15], [0.05, 0.5], [0.3, 0.85]],
    [[0.58, 0.05], [0.42, 0.95]],
    [[0.7, 0.15], [0.95, 0.5], [0.7, 0.85]],
  ],
  llaves: [LLAVE_IZQ.map(([x, y]) => [x - 0.2, y]), espejo(LLAVE_IZQ).map(([x, y]) => [x + 0.2, y])],
}

// ---------- Capa estática: Vía Láctea, nebulosas y planeta (se pinta una sola vez) ----------
const pintarCielo = (W, H, dpr) => {
  const azar = rng(777)
  const gauss = () => (azar() + azar() + azar() + azar() - 2) * 1.2
  const off = document.createElement('canvas')
  off.width = W * dpr
  off.height = H * dpr
  const g = off.getContext('2d')
  g.scale(dpr, dpr)

  // Vía Láctea: una banda diagonal con brillo difuso, estrellas finas y vetas de polvo
  g.save()
  g.translate(W * 0.55, H * 0.5)
  g.rotate(-0.52)
  const ancho = H * 0.3
  const brillo = g.createLinearGradient(0, -ancho, 0, ancho)
  brillo.addColorStop(0, 'rgba(150, 190, 255, 0)')
  brillo.addColorStop(0.5, 'rgba(170, 200, 255, 0.075)')
  brillo.addColorStop(1, 'rgba(150, 190, 255, 0)')
  g.fillStyle = brillo
  g.fillRect(-W, -ancho, W * 2, ancho * 2)
  const nucleo = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.34)
  nucleo.addColorStop(0, 'rgba(255, 215, 190, 0.07)')
  nucleo.addColorStop(1, 'rgba(255, 215, 190, 0)')
  g.fillStyle = nucleo
  g.fillRect(-W, -ancho, W * 2, ancho * 2)
  for (let i = 0; i < (W < 760 ? 450 : 1100); i++) {
    const x = (azar() - 0.5) * W * 1.6
    const y = gauss() * ancho * 0.45
    g.fillStyle = `rgba(${azar() < 0.2 ? '200, 230, 255' : '255, 255, 255'}, ${0.1 + azar() * 0.4})`
    g.fillRect(x, y, 1, 1)
  }
  g.fillStyle = 'rgba(3, 4, 10, 0.16)'
  for (let i = 0; i < 5; i++) {
    g.beginPath()
    g.ellipse((azar() - 0.5) * W * 1.1, gauss() * ancho * 0.25, 30 + azar() * 70, 4 + azar() * 7, 0, 0, 6.3)
    g.fill()
  }
  g.restore()

  // Nebulosas
  ;[
    [0.06, 0.3, 0.22, '255, 63, 143', 0.085],
    [0.96, 0.8, 0.26, '46, 231, 255', 0.07],
    [0.78, 0.12, 0.18, '255, 122, 69', 0.05],
  ].forEach(([fx, fy, fr, col, a]) => {
    const R = Math.max(W, H) * fr
    const n = g.createRadialGradient(W * fx, H * fy, 0, W * fx, H * fy, R)
    n.addColorStop(0, `rgba(${col}, ${a})`)
    n.addColorStop(1, `rgba(${col}, 0)`)
    g.fillStyle = n
    g.fillRect(0, 0, W, H)
  })
  return off
}

// Marte en 2D: disco con luz desde arriba a la izquierda, casquete polar y borde azulado
const crearMarte = (r, dpr) => {
  const c = document.createElement('canvas')
  const lado = Math.ceil((r + 8) * 2)
  c.width = lado * dpr
  c.height = lado * dpr
  const g = c.getContext('2d')
  g.scale(dpr, dpr)
  const m = lado / 2
  const halo = g.createRadialGradient(m, m, r * 0.9, m, m, r + 7)
  halo.addColorStop(0, 'rgba(90, 170, 255, 0.35)')
  halo.addColorStop(1, 'rgba(90, 170, 255, 0)')
  g.fillStyle = halo
  g.fillRect(0, 0, lado, lado)
  g.save()
  g.beginPath()
  g.arc(m, m, r, 0, Math.PI * 2)
  g.clip()
  const cuerpo = g.createRadialGradient(m - r * 0.45, m - r * 0.4, r * 0.1, m, m, r * 1.15)
  cuerpo.addColorStop(0, '#d9824f')
  cuerpo.addColorStop(0.5, '#9a4423')
  cuerpo.addColorStop(1, '#1d0a07')
  g.fillStyle = cuerpo
  g.fillRect(0, 0, lado, lado)
  const azar = rng(42)
  g.fillStyle = 'rgba(60, 20, 10, 0.35)'
  for (let i = 0; i < 6; i++) {
    g.beginPath()
    g.ellipse(m + (azar() - 0.5) * r * 1.2, m + (azar() - 0.4) * r, r * (0.12 + azar() * 0.25), r * (0.07 + azar() * 0.12), azar() * 3, 0, 6.3)
    g.fill()
  }
  g.fillStyle = 'rgba(240, 245, 255, 0.8)'
  g.beginPath()
  g.ellipse(m - r * 0.1, m - r * 0.96, r * 0.42, r * 0.14, 0, 0, 6.3)
  g.fill()
  g.restore()
  return { c, lado }
}

// Código decorativo con física real: velocidad orbital circular v = √(GM/r) alrededor de Marte
const SNIPPET = [
  'from math import sqrt',
  '',
  'G = 6.674e-11',
  'M = 6.42e23   # kg, Marte',
  'r = 3.8e6     # m, orbita',
  '',
  'def v_orbital(M, r):',
  '  return sqrt(G * M / r)',
  '',
  'print(v_orbital(M, r))',
  '# 3358 m/s',
].join('\n')

const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Un solo recorrido: si se hicieran reemplazos sucesivos, uno pisaría las etiquetas del anterior
const colorear = (t) =>
  escapar(t).replace(/(#.*$)|\b(\d[\d.]*(?:e-?\d+)?)\b|\b(import|from|def|return|print)\b/gm, (m, com, num) =>
    `<i class="${com ? 'c-com' : num ? 'c-str' : 'c-kw'}">${m}</i>`
  )

const FondoTecnico = () => {
  const canvasRef = useRef(null)
  const codigoRef = useRef(null)

  // Panel de código: se "escribe" solo, se queda un momento y vuelve a empezar
  useEffect(() => {
    const el = codigoRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML = colorear(SNIPPET)
      return
    }
    let n = 0
    let pausa = 0
    const id = setInterval(() => {
      if (document.hidden) return
      if (pausa > 0) {
        pausa--
        return
      }
      n++
      el.innerHTML = colorear(SNIPPET.slice(0, n)) + '<b class="c-cursor"></b>'
      if (n >= SNIPPET.length) {
        n = 0
        pausa = 90 // ~4 s con el código completo
      }
    }, 45)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const fase = faseLunar()
    let W = 0
    let H = 0
    let cielo = null
    let marte = null
    let estrellas = []
    let figuras = []
    let raf = 0
    let ultimo = 0
    let t = 0
    let scrollY = window.scrollY
    const meteoros = []
    const estela = []
    let proximoMeteoro = 3

    const ajustar = () => {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      cielo = pintarCielo(W, H, dpr)
      const radio = W < 760 ? 24 : 40
      marte = { ...crearMarte(radio, dpr), r: radio }
      const azar = rng(2525)
      estrellas = Array.from({ length: W < 760 ? 50 : 120 }, () => ({
        x: azar() * W, y: azar() * H, s: azar() < 0.15 ? 2 : 1, fase: azar() * 6.28,
        c: azar() < 0.25 ? CIAN : '255, 255, 255',
      }))
      // Constelaciones de código en los márgenes (solo en pantallas anchas)
      figuras = []
      if (W >= 760) {
        const lado = Math.min(120, Math.max(80, W * 0.06))
        figuras.push({ trazos: CONSTELACIONES.etiqueta, x: Math.max(24, W * 0.04), y: H * 0.4, w: lado, h: lado * 0.8, fase: 0 })
        figuras.push({ trazos: CONSTELACIONES.llaves, x: W - Math.max(24, W * 0.04) - lado, y: H * 0.55, w: lado, h: lado * 0.95, fase: 2 })
      }
    }

    const dibujar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(cielo, 0, 0, W, H)

      for (const e of estrellas) {
        const p = reducir ? 0.7 : 0.45 + 0.35 * Math.sin(t * 0.8 + e.fase)
        ctx.fillStyle = `rgba(${e.c}, ${p * 0.6})`
        ctx.fillRect(Math.round(e.x), Math.round(e.y), e.s, e.s)
      }

      // Constelaciones de código: líneas finas y estrellas en los vértices (leve paralaje con el scroll)
      const dy = reducir ? 0 : -scrollY * 0.05
      ctx.save()
      ctx.translate(0, dy)
      for (const f of figuras) {
        ctx.strokeStyle = `rgba(${CIAN}, 0.2)`
        ctx.lineWidth = 1
        for (const trazo of f.trazos) {
          ctx.beginPath()
          trazo.forEach(([px, py], i) => (i ? ctx.lineTo(f.x + px * f.w, f.y + py * f.h) : ctx.moveTo(f.x + px * f.w, f.y + py * f.h)))
          ctx.stroke()
        }
        let k = 0
        for (const trazo of f.trazos) {
          for (const [px, py] of trazo) {
            const x = Math.round(f.x + px * f.w)
            const y = Math.round(f.y + py * f.h)
            const p = reducir ? 0.7 : 0.5 + 0.5 * Math.sin(t * 1.3 + f.fase + k++)
            ctx.fillStyle = `rgba(${CIAN}, ${0.12 + 0.12 * p})`
            ctx.fillRect(x - 4, y - 4, 8, 8)
            ctx.fillStyle = `rgba(235, 252, 255, ${0.55 + 0.4 * p})`
            ctx.fillRect(x - 1, y - 1, 3, 3)
          }
        }
      }
      ctx.restore()

      // Marte con su órbita y un satélite
      const mx = W < 760 ? W * 0.84 : Math.max(80, W * 0.075)
      const my = W < 760 ? 120 : H * 0.17
      const rx = marte.r * 1.9
      const ry = marte.r * 0.62
      const inc = -0.38
      const punto = (a) => [
        mx + rx * Math.cos(a) * Math.cos(inc) - ry * Math.sin(a) * Math.sin(inc),
        my + rx * Math.cos(a) * Math.sin(inc) + ry * Math.sin(a) * Math.cos(inc),
      ]
      ctx.strokeStyle = `rgba(${CIAN}, 0.2)`
      ctx.setLineDash([4, 5])
      ctx.beginPath()
      ctx.ellipse(mx, my, rx, ry, inc, 0, 6.2832)
      ctx.stroke()
      ctx.setLineDash([])
      const ang = reducir ? 0.9 : t * 0.55
      const atras = Math.sin(ang) < 0 // pasa por detrás del planeta
      const [sx, sy] = punto(ang)
      const dibujarSat = () => {
        ctx.fillStyle = 'rgba(220, 240, 255, 0.95)'
        ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 3, 3)
        ctx.fillStyle = 'rgba(70, 150, 255, 0.9)'
        ctx.fillRect(Math.round(sx) - 6, Math.round(sy), 4, 1)
        ctx.fillRect(Math.round(sx) + 3, Math.round(sy), 4, 1)
      }
      if (!reducir) {
        estela.push([sx, sy])
        if (estela.length > 16) estela.shift()
        estela.forEach(([x, y], i) => {
          ctx.fillStyle = `rgba(${CIAN}, ${(i / estela.length) * 0.35})`
          ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        })
      }
      if (atras) dibujarSat()
      ctx.drawImage(marte.c, mx - marte.lado / 2, my - marte.lado / 2, marte.lado, marte.lado)
      if (!atras) dibujarSat()
      ctx.font = '10px ui-monospace, Consolas, monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(${CIAN}, 0.55)`
      if (W >= 760) {
        ctx.fillText('MARTE', mx, my + marte.r + 24)
        ctx.fillStyle = 'rgba(160, 175, 190, 0.45)'
        ctx.fillText('sol 24 h 39 min', mx, my + marte.r + 38)
      }

      // Luna con la fase real de hoy
      if (W > 760) {
        const lx = W - Math.min(110, W * 0.07)
        dibujarLuna(ctx, lx, 150, 20, fase)
        ctx.fillStyle = `rgba(${CIAN}, 0.55)`
        ctx.fillText(`LUNA ${Math.round(fase.iluminada * 100)}%`, lx, 188)
      }

      for (const m of meteoros) {
        const a = Math.sin(Math.PI * (m.vida / m.dur)) * 0.8
        const x = m.x + m.vx * m.vida
        const y = m.y + m.vy * m.vida
        const g = ctx.createLinearGradient(x, y, x - m.vx * 0.16, y - m.vy * 0.16)
        g.addColorStop(0, `rgba(235, 252, 255, ${a})`)
        g.addColorStop(1, 'rgba(46, 231, 255, 0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - m.vx * 0.16, y - m.vy * 0.16)
        ctx.stroke()
      }
    }

    const paso = (ahora) => {
      raf = requestAnimationFrame(paso)
      if (ahora - ultimo < 33) return // ~30 fps: es un fondo
      const dt = Math.min((ahora - ultimo) / 1000, 0.1)
      ultimo = ahora
      t += dt
      proximoMeteoro -= dt
      if (proximoMeteoro <= 0) {
        proximoMeteoro = 6 + Math.random() * 8
        meteoros.push({ x: W * (0.25 + Math.random() * 0.75), y: H * Math.random() * 0.45, vx: -(420 + Math.random() * 260), vy: 200 + Math.random() * 160, vida: 0, dur: 0.9 })
      }
      for (let i = meteoros.length - 1; i >= 0; i--) {
        meteoros[i].vida += dt
        if (meteoros[i].vida >= meteoros[i].dur) meteoros.splice(i, 1)
      }
      dibujar()
    }

    const iniciar = () => {
      cancelAnimationFrame(raf)
      if (!reducir && !document.hidden) raf = requestAnimationFrame(paso)
    }
    const alScroll = () => {
      scrollY = window.scrollY
      if (reducir) dibujar()
    }
    const alRedimensionar = () => {
      ajustar()
      dibujar()
    }

    ajustar()
    dibujar()
    iniciar()
    window.addEventListener('resize', alRedimensionar)
    window.addEventListener('scroll', alScroll, { passive: true })
    document.addEventListener('visibilitychange', iniciar)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', alRedimensionar)
      window.removeEventListener('scroll', alScroll)
      document.removeEventListener('visibilitychange', iniciar)
    }
  }, [])

  return (
    <div className="fondo-tecnico" aria-hidden="true">
      <img className="ft-rover" src={planoRover} alt="" loading="lazy" decoding="async" />
      <canvas ref={canvasRef} className="ft-lienzo" />
      <pre className="ft-codigo" ref={codigoRef} />
    </div>
  )
}

export default FondoTecnico
