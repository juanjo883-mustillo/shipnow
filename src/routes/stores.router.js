import { Router } from 'express'
import { getStores, createStore } from '../controllers/stores.controller.js'

const router = Router()

router.get('/', getStores)
router.post('/', createStore)

export default router
