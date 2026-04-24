import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: { error: '❌ Demasiadas peticiones, intenta más tarde' }
})

const limitadorContacto = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 mensajes por hora por IP
  message: { error: '❌ Demasiados mensajes enviados, intenta más tarde' }
})

export { helmet, limitador, limitadorContacto }