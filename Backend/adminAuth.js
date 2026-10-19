
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import process from 'node:process'

const config = () => {
  const { ADMIN_USER, ADMIN_HASH, JWT_SECRET } = process.env
  if (!ADMIN_USER || !ADMIN_HASH || !JWT_SECRET) {
    throw new Error('Faltan ADMIN_USER, ADMIN_HASH o JWT_SECRET. Ejecuta: node generar-credenciales.js')
  }
  if (JWT_SECRET.length < 32) throw new Error('JWT_SECRET es demasiado corto (mínimo 32 caracteres).')
  return { ADMIN_USER, ADMIN_HASH, JWT_SECRET, EXPIRA: process.env.JWT_EXPIRA || '1h' }
}

// Comparación en tiempo constante (no revela cuántos caracteres coinciden)
const igual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 intentos cada 15 min por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
})

const login = async (req, res) => {
  const { ADMIN_USER, ADMIN_HASH, JWT_SECRET, EXPIRA } = config()
  const { nombre, password } = req.body || {}
  if (typeof nombre !== 'string' || typeof password !== 'string' || password.length > 200) {
    return res.status(400).json({ error: 'Datos no válidos.' })
  }
  // Se comprueban SIEMPRE usuario y contraseña, para no revelar cuál de los dos falló
  const userOk = igual(nombre, ADMIN_USER)
  const passOk = await bcrypt.compare(password, ADMIN_HASH)
  if (!(userOk && passOk)) return res.status(401).json({ error: 'Credenciales incorrectas.' })

  const token = jwt.sign({ rol: 'admin' }, JWT_SECRET, { algorithm: 'HS256', expiresIn: EXPIRA })
  res.json({ token })
}

// Middleware: deja pasar solo con un token válido de administrador
const soloAdmin = (req, res, next) => {
  try {
    const { JWT_SECRET } = config()
    const [tipo, token] = (req.headers.authorization || '').split(' ')
    if (tipo !== 'Bearer' || !token) throw new Error('sin token')
    const datos = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    if (datos.rol !== 'admin') throw new Error('rol')
    next()
  } catch {
    res.status(401).json({ error: 'No autorizado' })
  }
}

// Llamar al arrancar: si falta algo en .env, el servidor no inicia (mejor que fallar en el primer login)
const validarConfig = () => config()

export { limiteLogin, login, soloAdmin, validarConfig }
