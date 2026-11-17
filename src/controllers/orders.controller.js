import { ordersService } from '../services/orders.service.js'
import { HTTP_STATUS } from '../constants/index.js'
import { sendSuccess } from '../utils/response.js'

export const createOrder = async (req, res, next) => {
  try {
    sendSuccess(res, await ordersService.createOrder(req.body), HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req, res, next) => {
  try {
    sendSuccess(res, await ordersService.getOrders())
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    sendSuccess(res, await ordersService.getOrderById(req.params.oid))
  } catch (error) {
    next(error)
  }
}

export const deliverOrder = async (req, res, next) => {
  try {
    sendSuccess(res, await ordersService.deliverOrder(req.params.oid))
  } catch (error) {
    next(error)
  }
}
