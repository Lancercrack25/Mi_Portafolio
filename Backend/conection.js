import pkg from 'pg'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const { Pool, Client } = pkg

const adminClient = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres'
})

await adminClient.connect()

const res = await adminClient.query(
  `SELECT 1 FROM pg_database WHERE datname = 'portafolio'`
)

if (res.rowCount === 0) {
  await adminClient.query('CREATE DATABASE portafolio')
  console.log('✅ Base de datos portafolio creada')
}

await adminClient.end()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'portafolio'
})

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión:', err))

export default pool