import express from 'express'
import apiRouter from './routes/index.js'
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js'

// app.js arma Express y lo exporta sin conectar a la base ni abrir un puerto.
// Así, en el Módulo 6, Supertest puede importar la app directamente.
const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
