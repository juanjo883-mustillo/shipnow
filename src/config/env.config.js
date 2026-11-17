// Único archivo del proyecto que lee process.env.
// Si falta una variable crítica, la app no arranca y avisa cuál falta.
import dotenv from 'dotenv'
import { NODE_ENVS } from '../constants/index.js'

dotenv.config()

const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV', 'JWT_SECRET']

const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name])
if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
      'Revisá tu archivo .env (usá .env.example como guía).'
  )
}

const port = Number(process.env.PORT)
if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`PORT debe ser un número entero positivo. Valor recibido: "${process.env.PORT}"`)
}

const validEnvs = Object.values(NODE_ENVS)
if (!validEnvs.includes(process.env.NODE_ENV)) {
  throw new Error(
    `NODE_ENV inválido: "${process.env.NODE_ENV}". Valores permitidos: ${validEnvs.join(', ')}`
  )
}

export const config = Object.freeze({
  port,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  isProduction: process.env.NODE_ENV === NODE_ENVS.PRODUCTION,
})
