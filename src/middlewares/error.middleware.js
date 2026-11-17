import mongoose from 'mongoose'
import { config } from '../config/index.js'
import { ERRORS, HTTP_STATUS, RESPONSE_STATUS } from '../constants/index.js'

const MONGO_DUPLICATE_KEY = 11000

// Traduce errores técnicos (Mongoose/Mongo) a errores del diccionario.
const normalizeError = (error) => {
  if (error.name === 'AppError') return error
  if (error instanceof mongoose.Error.CastError) return { ...ERRORS.INVALID_ID }
  if (error instanceof mongoose.Error.ValidationError) {
    return { ...ERRORS.VALIDATION_ERROR, details: Object.values(error.errors).map((e) => e.message) }
  }
  if (error.code === MONGO_DUPLICATE_KEY) return { ...ERRORS.EMAIL_ALREADY_EXISTS }
  if (error.type === 'entity.parse.failed') {
    return { ...ERRORS.VALIDATION_ERROR, message: 'El body no es un JSON válido' }
  }
  return { ...ERRORS.INTERNAL_ERROR }
}

export const notFoundHandler = (req, res) => {
  const { code, status, message } = ERRORS.ROUTE_NOT_FOUND
  res.status(status).json({ status: RESPONSE_STATUS.ERROR, error: { code, message } })
}

// Middleware de errores provisorio: único lugar que arma respuestas de error.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
  const { code, status, message, details } = normalizeError(error)

  if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) console.error(error)

  const body = { status: RESPONSE_STATUS.ERROR, error: { code, message } }
  if (details) body.error.details = details
  if (!config.isProduction && status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    body.error.debug = error.message
  }

  res.status(status).json(body)
}
