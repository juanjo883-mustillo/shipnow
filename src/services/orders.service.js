import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { storesRepository } from '../repositories/stores.repository.js'
import { ORDER_STATUS, ERRORS } from '../constants/index.js'
import { AppError } from '../utils/app-error.js'

// Regla de negocio pura: se puede testear sin base de datos ni Express.
export const calculateOrderTotal = (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)

const validateOrderData = ({ userId, storeId, address, items } = {}) => {
  const errors = []
  if (!userId) errors.push('userId es obligatorio')
  if (!storeId) errors.push('storeId es obligatorio')
  if (typeof address !== 'string' || address.trim() === '') errors.push('address es obligatorio')
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('items debe ser una lista con al menos un producto')
  } else if (
    items.some(
      (item) =>
        typeof item.name !== 'string' ||
        typeof item.price !== 'number' ||
        item.price < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    )
  ) {
    errors.push('cada item necesita name (texto), price (número >= 0) y quantity (entero >= 1)')
  }
  if (errors.length > 0) throw new AppError(ERRORS.VALIDATION_ERROR, errors)
}

const ensureExists = (order) => {
  if (!order) throw new AppError(ERRORS.ORDER_NOT_FOUND)
  return order
}

export const ordersService = {
  createOrder: async (data) => {
    validateOrderData(data)
    const { userId, storeId, address, items } = data

    if (!(await usersRepository.findById(userId))) throw new AppError(ERRORS.USER_NOT_FOUND)
    if (!(await storesRepository.findById(storeId))) throw new AppError(ERRORS.STORE_NOT_FOUND)

    return ordersRepository.create({
      userId,
      storeId,
      address,
      items,
      total: calculateOrderTotal(items),
      status: ORDER_STATUS.PENDING,
    })
  },

  getOrders: () => ordersRepository.findAll(),

  getOrderById: async (id) => ensureExists(await ordersRepository.findById(id)),

  deliverOrder: async (id) => {
    const order = ensureExists(await ordersRepository.findById(id))
    if (order.status === ORDER_STATUS.DELIVERED) throw new AppError(ERRORS.ORDER_ALREADY_DELIVERED)
    return ordersRepository.updateStatus(id, ORDER_STATUS.DELIVERED)
  },
}
