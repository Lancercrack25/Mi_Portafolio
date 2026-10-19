import readline from 'node:readline'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import process from 'node:process'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
let oculto = false
const escribirOriginal = rl._writeToOutput.bind(rl)
// Mientras "oculto" sea true, lo que se teclea no se imprime en pantalla
rl._writeToOutput = (s) => {
  if (!oculto || s.includes('\n')) escribirOriginal(s)
}

// Cola de líneas: funciona igual escribiendo en la terminal que recibiendo texto por una tubería
const cola = []
const esperando = []
rl.on('line', (linea) => (esperando.length ? esperando.shift()(linea) : cola.push(linea)))

const preguntar = (texto, ocultar = false) => {
  process.stdout.write(texto)
  oculto = ocultar
  return new Promise((resolve) => {
    const listo = (linea) => {
      oculto = false
      if (ocultar) process.stdout.write('\n')
      resolve(linea)
    }
    if (cola.length) listo(cola.shift())
    else esperando.push(listo)
  })
}

;(async () => {
  const usuario = (await preguntar('Usuario admin: ')).trim()
  const pass = await preguntar('Contraseña (mínimo 12 caracteres): ', true)
  const confirmar = await preguntar('Repite la contraseña: ', true)
  rl.close()
  if (!usuario) return console.error('El usuario no puede estar vacío.')
  if (pass.length < 12) return console.error('La contraseña debe tener al menos 12 caracteres.')
  if (pass !== confirmar) return console.error('Las contraseñas no coinciden.')

  const hash = await bcrypt.hash(pass, 12)
  const secreto = crypto.randomBytes(48).toString('base64url')
  console.log('\nPega estas líneas en tu archivo .env (y comprueba que .env esté en .gitignore):\n')
  console.log(`ADMIN_USER=${usuario}`)
  console.log(`ADMIN_HASH='${hash}'`) // comillas simples: el hash lleva signos $
  console.log(`JWT_SECRET=${secreto}`)
  console.log('ORIGENES=http://localhost:5173   # en producción: https://tu-dominio.com')
})()
