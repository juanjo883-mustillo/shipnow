import { Router } from 'express'
import productsRouter from './products.router.js'
import usersRouter from './users.router.js'
import storesRouter from './stores.router.js'
import ordersRouter from './orders.router.js'

const router = Router()

router.use('/products', productsRouter)
router.use('/users', usersRouter)
router.use('/stores', storesRouter)
router.use('/orders', ordersRouter)

export default router
