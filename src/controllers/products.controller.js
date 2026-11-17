import { productsService } from '../services/products.service.js'
import { HTTP_STATUS } from '../constants/index.js'
import { sendSuccess } from '../utils/response.js'

// El controller traduce HTTP <-> service. No conoce Mongoose ni reglas de negocio.

export const getAvailableProducts = async (req, res, next) => {
  try {
    sendSuccess(res, await productsService.getAvailableProducts(req.query))
  } catch (error) {
    next(error)
  }
}

export const getInventory = async (req, res, next) => {
  try {
    sendSuccess(res, await productsService.getInventory(req.query))
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req, res, next) => {
  try {
    sendSuccess(res, await productsService.getProductById(req.params.pid))
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    sendSuccess(res, await productsService.createProduct(req.body), HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    sendSuccess(res, await productsService.updateProduct(req.params.pid, req.body))
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await productsService.deleteProduct(req.params.pid)
    res.status(HTTP_STATUS.NO_CONTENT).end()
  } catch (error) {
    next(error)
  }
}
