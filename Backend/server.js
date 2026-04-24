import { config } from 'dotenv'
import process from 'node:process'
config()
import express from 'express'
import cors from 'cors'
import pool from './conection.js'
import { initTablas } from './tablas.js'
import './tablas.js'
import { helmet, limitador, limitadorContacto } from './seguridad.js'

await initTablas()
const app = express()

app.use(helmet())
app.use(limitador)
app.use(cors({
  origin: 'http://localhost:5173' // solo permite peticiones desde tu frontend
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Servidor corriendo correctamente' })
})

app.post('/contacto', limitadorContacto, async (req, res) => {
  const { nombre, email, mensaje } = req.body

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: '❌ Todos los campos son requeridos' })
  }

  try {
    await pool.query(
      'INSERT INTO contacto (nombre, email, mensaje) VALUES ($1, $2, $3)',
      [nombre, email, mensaje]
    )
    res.json({ mensaje: '✅ Mensaje enviado correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '❌ Error al guardar el mensaje' })
  }
})

app.get('/contacto', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacto ORDER BY fecha DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '❌ Error al obtener los mensajes' })
  }
})

app.post('/admin/login', (req, res) => {
  const { nombre, password } = req.body

  if (
    nombre === process.env.AD_NAME &&
    password === process.env.AD_PASSWORD
  ) {
    res.json({ success: true, mensaje: '✅ Bienvenido admin' })
  } else {
    res.status(401).json({ success: false, error: '❌ Credenciales incorrectas' })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
})