import { Router } from 'express'
import { createOrder, getOrders, getOrderById, deliverOrder } from '../controllers/orders.controller.js'

const router = Router()

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:oid', getOrderById)
router.patch('/:oid/deliver', deliverOrder)

export default router
