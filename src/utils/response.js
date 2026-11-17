import { HTTP_STATUS, RESPONSE_STATUS } from '../constants/index.js'

// Envelope de éxito estándar de ShipNow: { status: 'success', payload }
export const sendSuccess = (res, payload, statusCode = HTTP_STATUS.OK) =>
  res.status(statusCode).json({ status: RESPONSE_STATUS.SUCCESS, payload })
