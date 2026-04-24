import pool from './conection.js'
import process from 'node:process'

export async function initTablas() {
  try {
    console.log('Inicializando tablas...')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacto (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT NOW()
      );
    `)

    console.log('✅ Tablas creadas correctamente')

  } catch (error) {
    console.error('❌ Error al crear tablas:', error)
    process.exit(1)
  }
}