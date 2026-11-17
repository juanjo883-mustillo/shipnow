import { Router } from 'express'
import {
  getAvailableProducts,
  getInventory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', getAvailableProducts)
router.get('/inventory', getInventory)
router.get('/:pid', getProductById)
router.post('/', createProduct)
router.put('/:pid', updateProduct)
router.delete('/:pid', deleteProduct)

export default router
