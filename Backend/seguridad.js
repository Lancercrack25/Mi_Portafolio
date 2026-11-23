import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: { error: 'Demasiadas peticiones,intenta de  nuevo mas tarde' }
})
const limitadorContacto = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 mensajes por hora por IP
  message: { error: ' pasate el limite de mensajes, intenta más tarde' }
})
export { helmet, limitador, limitadorContacto }